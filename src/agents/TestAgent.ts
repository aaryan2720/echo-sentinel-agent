/**
 * TestAgent - Simple agent for testing the BaseAgent framework
 * 
 * Processes test tasks and demonstrates the agent lifecycle
 */

import { BaseAgent, AgentTask } from './BaseAgent';

export class TestAgent extends BaseAgent {
  /**
   * Process a test task
   */
  protected async processTask(task: AgentTask): Promise<any> {
    this.log('info', `TestAgent processing task: ${task.type}`);
    
    // Simulate some work
    await this.sleep(Math.random() * 2000 + 1000); // 1-3 seconds
    
    // Generate result
    const result = {
      taskId: task.taskId,
      type: task.type,
      data: task.data,
      result: `Processed at ${new Date().toISOString()}`,
      success: true,
    };
    
    this.log('info', `TestAgent completed task: ${task.type}`);
    return result;
  }
}

// Example usage (for testing)
export async function testAgentExample() {
  console.log('=== Testing Agent Framework ===\n');
  
  // Create test agent
  const agent = new TestAgent({
    agentId: 'test-agent-001',
    name: 'Test Agent',
    type: 'test',
    maxConcurrentTasks: 2,
    timeout: 5000,
    retryAttempts: 3,
  });

  try {
    // Initialize
    console.log('1. Initializing agent...');
    await agent.initialize();
    
    // Start
    console.log('2. Starting agent...');
    await agent.start();
    
    // Add some tasks
    console.log('3. Adding tasks to queue...');
    await agent.addTask('analyze_image', { url: 'test.jpg' }, 5);
    await agent.addTask('analyze_video', { url: 'test.mp4' }, 10); // Higher priority
    await agent.addTask('analyze_audio', { url: 'test.mp3' }, 3);
    
    console.log(`Queue length: ${agent.getQueueLength()}`);
    
    // Wait for tasks to complete
    console.log('4. Processing tasks...');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Check metrics
    console.log('5. Agent metrics:');
    const metrics = agent.getMetrics();
    console.log(JSON.stringify(metrics, null, 2));
    
    // Stop agent
    console.log('6. Stopping agent...');
    await agent.stop();
    
    console.log('\n=== Test Complete ===');
  } catch (error) {
    console.error('Test failed:', error);
  }
}
