/**
 * EchoBreaker Agent System - Main Exports
 * 
 * Central export file for the agent system
 */

// Base agent framework
export { BaseAgent, type AgentStatus, type AgentConfig, type AgentTask, type AgentMetrics } from './BaseAgent';

// Agent hub
export { AgentHub, agentHub, type AgentInfo, type AgentMessage, type MessageHandler } from './AgentHub';

// Test agent
export { TestAgent, testAgentExample } from './TestAgent';

// Configuration
export { agentConfig, type AgentConfig as AgentSystemConfig } from './config';

// Future agent exports will go here:
// export { VisualAnalysisAgent } from './VisualAnalysisAgent';
// export { AudioAnalysisAgent } from './AudioAnalysisAgent';
// export { NetworkAnalysisAgent } from './NetworkAnalysisAgent';
// export { ContentIngestionAgent } from './ContentIngestionAgent';
// export { AgentCoordinator } from './AgentCoordinator';
// export { HumanReviewRouter } from './HumanReviewRouter';
