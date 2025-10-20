/**
 * AgentHub - Central communication and coordination hub for all agents
 * 
 * Features:
 * - Agent registration and discovery
 * - Message routing between agents
 * - Task distribution and load balancing
 * - Health monitoring
 * - Event broadcasting
 */

import { BaseAgent, AgentStatus } from './BaseAgent';

export interface AgentInfo {
  agentId: string;
  name: string;
  type: string;
  status: AgentStatus;
  queueLength: number;
  metrics: any;
}

export interface AgentMessage {
  messageId: string;
  fromAgent: string;
  toAgent?: string; // undefined = broadcast
  type: string;
  payload: any;
  timestamp: Date;
}

export type MessageHandler = (message: AgentMessage) => void | Promise<void>;

export class AgentHub {
  private static instance: AgentHub;
  private agents: Map<string, BaseAgent> = new Map();
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private messageLog: AgentMessage[] = [];
  private isRunning: boolean = false;

  private constructor() {
    this.log('info', 'AgentHub initialized');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AgentHub {
    if (!AgentHub.instance) {
      AgentHub.instance = new AgentHub();
    }
    return AgentHub.instance;
  }

  /**
   * Register an agent with the hub
   */
  registerAgent(agent: BaseAgent): void {
    const agentId = (agent as any).config.agentId;
    const agentName = (agent as any).config.name;
    
    if (this.agents.has(agentId)) {
      this.log('warn', `Agent ${agentId} is already registered`);
      return;
    }

    this.agents.set(agentId, agent);
    this.log('info', `Agent registered: ${agentName} (${agentId})`);
    
    // Broadcast registration event
    this.broadcastMessage({
      messageId: this.generateMessageId(),
      fromAgent: 'hub',
      type: 'agent_registered',
      payload: { agentId, agentName },
      timestamp: new Date(),
    });
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      this.log('warn', `Agent ${agentId} not found`);
      return;
    }

    this.agents.delete(agentId);
    this.log('info', `Agent unregistered: ${agentId}`);
    
    // Broadcast unregistration event
    this.broadcastMessage({
      messageId: this.generateMessageId(),
      fromAgent: 'hub',
      type: 'agent_unregistered',
      payload: { agentId },
      timestamp: new Date(),
    });
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent info for all agents
   */
  getAgentInfos(): AgentInfo[] {
    return this.getAllAgents().map(agent => {
      const config = (agent as any).config;
      return {
        agentId: config.agentId,
        name: config.name,
        type: config.type,
        status: agent.getStatus(),
        queueLength: agent.getQueueLength(),
        metrics: agent.getMetrics(),
      };
    });
  }

  /**
   * Send a message to a specific agent
   */
  sendMessage(toAgent: string, type: string, payload: any, fromAgent: string = 'hub'): void {
    const message: AgentMessage = {
      messageId: this.generateMessageId(),
      fromAgent,
      toAgent,
      type,
      payload,
      timestamp: new Date(),
    };

    this.messageLog.push(message);
    this.deliverMessage(message);
  }

  /**
   * Broadcast a message to all agents
   */
  broadcastMessage(message: Partial<AgentMessage>): void {
    const fullMessage: AgentMessage = {
      messageId: message.messageId || this.generateMessageId(),
      fromAgent: message.fromAgent || 'hub',
      type: message.type!,
      payload: message.payload,
      timestamp: message.timestamp || new Date(),
    };

    this.messageLog.push(fullMessage);
    
    // Deliver to all message handlers
    const handlers = this.messageHandlers.get(fullMessage.type) || new Set();
    handlers.forEach(handler => {
      try {
        handler(fullMessage);
      } catch (error) {
        this.log('error', `Message handler error: ${error}`);
      }
    });
  }

  /**
   * Subscribe to messages of a specific type
   */
  subscribe(messageType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    
    this.messageHandlers.get(messageType)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(messageType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  /**
   * Route a task to the best available agent
   */
  async routeTask(agentType: string, taskType: string, data: any, priority: number = 0): Promise<string | null> {
    // Find agents of the requested type
    const suitableAgents = this.getAllAgents().filter(agent => {
      const config = (agent as any).config;
      return config.type === agentType;
    });

    if (suitableAgents.length === 0) {
      this.log('error', `No agents found for type: ${agentType}`);
      return null;
    }

    // Find agent with smallest queue (load balancing)
    let bestAgent = suitableAgents[0];
    let minQueue = bestAgent.getQueueLength();

    for (const agent of suitableAgents) {
      const queueLength = agent.getQueueLength();
      if (queueLength < minQueue) {
        bestAgent = agent;
        minQueue = queueLength;
      }
    }

    // Add task to selected agent
    const taskId = await bestAgent.addTask(taskType, data, priority);
    
    const config = (bestAgent as any).config;
    this.log('info', `Task routed to ${config.name} (queue: ${minQueue})`);
    
    return taskId;
  }

  /**
   * Get system health status
   */
  getSystemHealth(): {
    totalAgents: number;
    activeAgents: number;
    idleAgents: number;
    processingAgents: number;
    errorAgents: number;
    totalQueuedTasks: number;
  } {
    const infos = this.getAgentInfos();
    
    return {
      totalAgents: infos.length,
      activeAgents: infos.filter(a => a.status !== 'error').length,
      idleAgents: infos.filter(a => a.status === 'idle').length,
      processingAgents: infos.filter(a => a.status === 'processing').length,
      errorAgents: infos.filter(a => a.status === 'error').length,
      totalQueuedTasks: infos.reduce((sum, a) => sum + a.queueLength, 0),
    };
  }

  /**
   * Get message log
   */
  getMessageLog(limit: number = 100): AgentMessage[] {
    return this.messageLog.slice(-limit);
  }

  /**
   * Clear message log
   */
  clearMessageLog(): void {
    this.messageLog = [];
    this.log('info', 'Message log cleared');
  }

  /**
   * Deliver a message to handlers
   */
  private deliverMessage(message: AgentMessage): void {
    const handlers = this.messageHandlers.get(message.type) || new Set();
    
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        this.log('error', `Message handler error: ${error}`);
      }
    });
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Logging utility
   */
  private log(level: 'info' | 'warn' | 'error', message: string): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [AgentHub] [${level.toUpperCase()}]`;
    
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

// Export singleton instance
export const agentHub = AgentHub.getInstance();
