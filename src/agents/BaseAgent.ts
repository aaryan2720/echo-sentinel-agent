/**
 * BaseAgent - Abstract base class for all EchoBreaker AI agents
 * 
 * Provides common functionality:
 * - Lifecycle management (initialize, start, stop, restart)
 * - Status tracking and database updates
 * - Error handling and logging
 * - Task queue management
 * - Performance metrics
 */

import { v4 as uuidv4 } from 'uuid';
import { supabase, updateAgentStatus, Agent } from '@/lib/supabase';

export type AgentStatus = Agent['status'];

export interface AgentConfig {
  agentId: string;
  name: string;
  type: string;
  maxConcurrentTasks?: number;
  timeout?: number;
  retryAttempts?: number;
}

export interface AgentTask {
  taskId: string;
  type: string;
  priority: number;
  data: any;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface AgentMetrics {
  tasksProcessed: number;
  tasksSucceeded: number;
  tasksFailed: number;
  tasksCompleted: number; // Alias for tasksSucceeded
  averageProcessingTime: number;
  uptime: number;
  lastActive: Date;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected status: AgentStatus = 'idle';
  protected currentTask: string | null = null;
  protected taskQueue: AgentTask[] = [];
  protected metrics: AgentMetrics;
  protected startTime: Date | null = null;
  protected isRunning: boolean = false;
  protected processingTasks: Set<string> = new Set();

  constructor(config: AgentConfig) {
    this.config = {
      maxConcurrentTasks: 1,
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      ...config,
    };

    this.metrics = {
      tasksProcessed: 0,
      tasksSucceeded: 0,
      tasksFailed: 0,
      tasksCompleted: 0,
      averageProcessingTime: 0,
      uptime: 0,
      lastActive: new Date(),
    };

    this.log('info', `Agent ${this.config.name} created`);
  }

  /**
   * Initialize the agent - override in subclasses for setup logic
   */
  async initialize(): Promise<void> {
    this.log('info', `Initializing agent ${this.config.name}...`);
    
    try {
      // Update database with initial status
      await this.updateDatabaseStatus('idle');
      this.log('info', `Agent ${this.config.name} initialized successfully`);
    } catch (error) {
      this.log('error', `Failed to initialize agent: ${error}`);
      throw error;
    }
  }

  /**
   * Start the agent - begins processing tasks
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.log('warn', 'Agent is already running');
      return;
    }

    this.log('info', `Starting agent ${this.config.name}...`);
    this.isRunning = true;
    this.startTime = new Date();
    this.status = 'idle';
    
    await this.updateDatabaseStatus('idle');
    
    // Start processing loop
    this.processQueue();
    
    this.log('info', `Agent ${this.config.name} started successfully`);
  }

  /**
   * Stop the agent - gracefully shutdown
   */
  async stop(): Promise<void> {
    this.log('info', `Stopping agent ${this.config.name}...`);
    this.isRunning = false;
    this.status = 'idle';
    
    // Wait for current tasks to complete
    while (this.processingTasks.size > 0) {
      await this.sleep(100);
    }
    
    await this.updateDatabaseStatus('idle');
    this.log('info', `Agent ${this.config.name} stopped`);
  }

  /**
   * Restart the agent
   */
  async restart(): Promise<void> {
    this.log('info', `Restarting agent ${this.config.name}...`);
    await this.stop();
    await this.sleep(1000);
    await this.start();
  }

  /**
   * Add a task to the queue
   */
  async addTask(type: string, data: any, priority: number = 0): Promise<string> {
    const taskId = uuidv4();
    
    const task: AgentTask = {
      taskId,
      type,
      priority,
      data,
      createdAt: new Date(),
    };

    // Insert task in priority order (higher priority first)
    const insertIndex = this.taskQueue.findIndex(t => t.priority < priority);
    if (insertIndex === -1) {
      this.taskQueue.push(task);
    } else {
      this.taskQueue.splice(insertIndex, 0, task);
    }

    this.log('info', `Task ${taskId} added to queue (priority: ${priority})`);
    
    // Trigger processing if agent is idle
    if (this.status === 'idle') {
      this.processQueue();
    }

    return taskId;
  }

  /**
   * Get current agent status
   */
  getStatus(): AgentStatus {
    return this.status;
  }

  /**
   * Get agent metrics
   */
  getMetrics(): AgentMetrics {
    if (this.startTime) {
      this.metrics.uptime = Date.now() - this.startTime.getTime();
    }
    return { ...this.metrics };
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.taskQueue.length;
  }

  /**
   * Abstract method - must be implemented by subclasses
   * This is where the actual agent logic goes
   */
  protected abstract processTask(task: AgentTask): Promise<any>;

  /**
   * Process the task queue
   */
  private async processQueue(): Promise<void> {
    while (this.isRunning && this.taskQueue.length > 0) {
      // Check if we can process more tasks
      if (this.processingTasks.size >= (this.config.maxConcurrentTasks || 1)) {
        await this.sleep(100);
        continue;
      }

      // Get next task
      const task = this.taskQueue.shift();
      if (!task) continue;

      // Process task asynchronously
      this.executeTask(task);
    }
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: AgentTask): Promise<void> {
    this.processingTasks.add(task.taskId);
    task.startedAt = new Date();
    
    this.status = 'processing';
    this.currentTask = task.type;
    await this.updateDatabaseStatus('processing', task.type);

    this.log('info', `Processing task ${task.taskId} (${task.type})`);

    const startTime = Date.now();
    let attempt = 0;
    let lastError: any = null;

    while (attempt < (this.config.retryAttempts || 3)) {
      try {
        // Execute task with timeout
        const result = await Promise.race([
          this.processTask(task),
          this.timeout(this.config.timeout || 30000),
        ]);

        // Task succeeded
        task.completedAt = new Date();
        const processingTime = Date.now() - startTime;

        this.metrics.tasksProcessed++;
        this.metrics.tasksSucceeded++;
        this.metrics.tasksCompleted++; // Also increment tasksCompleted
        this.updateAverageProcessingTime(processingTime);
        this.metrics.lastActive = new Date();

        this.log('info', `Task ${task.taskId} completed in ${processingTime}ms`);
        this.processingTasks.delete(task.taskId);
        
        // Back to idle if no more tasks
        if (this.processingTasks.size === 0) {
          this.status = 'idle';
          this.currentTask = null;
          await this.updateDatabaseStatus('idle');
        }

        return;
      } catch (error) {
        attempt++;
        lastError = error;
        this.log('error', `Task ${task.taskId} failed (attempt ${attempt}): ${error}`);
        
        if (attempt < (this.config.retryAttempts || 3)) {
          await this.sleep(1000 * attempt); // Exponential backoff
        }
      }
    }

    // Task failed after all retries
    task.error = String(lastError);
    task.completedAt = new Date();
    
    this.metrics.tasksProcessed++;
    this.metrics.tasksFailed++;
    this.metrics.lastActive = new Date();

    this.log('error', `Task ${task.taskId} failed after ${this.config.retryAttempts} attempts`);
    this.processingTasks.delete(task.taskId);
    
    // Back to idle if no more tasks
    if (this.processingTasks.size === 0) {
      this.status = 'idle';
      this.currentTask = null;
      await this.updateDatabaseStatus('idle');
    }
  }

  /**
   * Update agent status in database
   */
  protected async updateDatabaseStatus(status: AgentStatus, currentTask?: string): Promise<void> {
    try {
      await updateAgentStatus(
        this.config.agentId,
        status,
        currentTask || undefined
      );
    } catch (error) {
      this.log('error', `Failed to update database status: ${error}`);
    }
  }

  /**
   * Update average processing time metric
   */
  private updateAverageProcessingTime(newTime: number): void {
    const totalTasks = this.metrics.tasksSucceeded;
    const currentAvg = this.metrics.averageProcessingTime;
    
    this.metrics.averageProcessingTime = 
      ((currentAvg * (totalTasks - 1)) + newTime) / totalTasks;
  }

  /**
   * Timeout utility
   */
  protected timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Task timeout after ${ms}ms`)), ms)
    );
  }

  /**
   * Sleep utility
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Logging utility
   */
  protected log(level: 'info' | 'warn' | 'error', message: string): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.config.name}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'info':
        console.log(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
    }
  }
}
