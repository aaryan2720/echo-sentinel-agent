import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DemoBanner } from "@/components/DemoBanner";
import { LogOut, Play, Square, RotateCw, Plus, Activity, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TestAgent, agentHub, type AgentInfo } from "@/agents";

const AgentTest = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Create test agents
  const createTestAgents = async () => {
    try {
      addLog('Creating 3 test agents...');
      
      const agent1 = new TestAgent({
        agentId: 'test-agent-001',
        name: 'Test Agent Alpha',
        type: 'test',
        maxConcurrentTasks: 2,
        timeout: 5000,
        retryAttempts: 3,
      });

      const agent2 = new TestAgent({
        agentId: 'test-agent-002',
        name: 'Test Agent Beta',
        type: 'test',
        maxConcurrentTasks: 3,
        timeout: 5000,
        retryAttempts: 3,
      });

      const agent3 = new TestAgent({
        agentId: 'test-agent-003',
        name: 'Test Agent Gamma',
        type: 'test',
        maxConcurrentTasks: 1,
        timeout: 5000,
        retryAttempts: 3,
      });

      // Initialize agents
      addLog('Initializing agents...');
      await agent1.initialize();
      await agent2.initialize();
      await agent3.initialize();

      // Register with hub
      addLog('Registering agents with hub...');
      agentHub.registerAgent(agent1);
      agentHub.registerAgent(agent2);
      agentHub.registerAgent(agent3);

      // Start agents
      addLog('Starting agents...');
      await agent1.start();
      await agent2.start();
      await agent3.start();

      addLog('✅ All agents created and started!');
      updateAgentInfo();
      
      return [agent1, agent2, agent3];
    } catch (error) {
      addLog(`❌ Error creating agents: ${error}`);
      return [];
    }
  };

  // Update agent information
  const updateAgentInfo = () => {
    const agentInfos = agentHub.getAgentInfos();
    setAgents(agentInfos);
    
    const health = agentHub.getSystemHealth();
    setSystemHealth(health);
    
    const messageLog = agentHub.getMessageLog(10);
    setMessages(messageLog);
  };

  // Run comprehensive test
  const runTest = async () => {
    setIsTestRunning(true);
    setLogs([]);
    
    try {
      addLog('🚀 Starting Agent Framework Test...');
      addLog('');

      // Create agents
      const testAgents = await createTestAgents();
      if (testAgents.length === 0) {
        addLog('❌ Failed to create agents');
        setIsTestRunning(false);
        return;
      }

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add tasks with different priorities
      addLog('📋 Adding tasks to queue...');
      addLog('  - Task 1: Priority 10 (High)');
      addLog('  - Task 2: Priority 5 (Medium)');
      addLog('  - Task 3: Priority 1 (Low)');
      addLog('  - Task 4: Priority 8 (High)');
      addLog('  - Task 5: Priority 3 (Low)');

      await testAgents[0].addTask('analyze_image', { url: 'test1.jpg' }, 10);
      await testAgents[0].addTask('analyze_video', { url: 'test2.mp4' }, 5);
      await testAgents[1].addTask('analyze_audio', { url: 'test3.mp3' }, 1);
      await testAgents[1].addTask('detect_network', { accounts: 50 }, 8);
      await testAgents[2].addTask('verify_content', { text: 'sample' }, 3);

      updateAgentInfo();

      // Monitor progress
      addLog('');
      addLog('⏳ Processing tasks (watch the agents work)...');
      
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateAgentInfo();
        
        const health = agentHub.getSystemHealth();
        if (health.totalQueuedTasks === 0 && health.processingAgents === 0) {
          addLog('✅ All tasks completed!');
          break;
        }
      }

      // Show final metrics
      addLog('');
      addLog('📊 Final Metrics:');
      const agentInfos = agentHub.getAgentInfos();
      agentInfos.forEach(info => {
        addLog(`  - ${info.name}:`);
        addLog(`    • Tasks: ${info.metrics.tasksProcessed}`);
        addLog(`    • Success: ${info.metrics.tasksSucceeded}`);
        addLog(`    • Failed: ${info.metrics.tasksFailed}`);
        addLog(`    • Avg Time: ${info.metrics.averageProcessingTime}ms`);
      });

      addLog('');
      addLog('🎉 Test Complete!');
      
    } catch (error) {
      addLog(`❌ Test error: ${error}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  // Stop all agents
  const stopAllAgents = async () => {
    addLog('Stopping all agents...');
    const allAgents = agentHub.getAllAgents();
    
    for (const agent of allAgents) {
      try {
        await agent.stop();
      } catch (error) {
        addLog(`Error stopping agent: ${error}`);
      }
    }
    
    addLog('✅ All agents stopped');
    updateAgentInfo();
  };

  // Auto-update every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (agentHub.getAllAgents().length > 0) {
        updateAgentInfo();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative">
      <DemoBanner />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-4 border-b border-border/50 mt-12">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo />
              <span className="text-2xl font-bold font-mono text-primary">EchoBreaker</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="font-mono">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/agents')} className="font-mono">
                Agents
              </Button>
              <Button variant="default" className="font-mono">
                Agent Test
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="font-mono">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </nav>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-mono text-primary">
            🧪 Agent Framework Test Lab
          </h1>
          <p className="text-muted-foreground">Test the BaseAgent framework and AgentHub communication system</p>
        </div>

        {/* Control Panel */}
        <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h2 className="text-xl font-bold mb-4 font-mono">Control Panel</h2>
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={runTest} 
              disabled={isTestRunning}
              className="font-mono"
            >
              <Play className="w-4 h-4 mr-2" />
              {isTestRunning ? 'Test Running...' : 'Run Full Test'}
            </Button>
            <Button 
              onClick={stopAllAgents}
              variant="outline"
              className="font-mono"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop All Agents
            </Button>
            <Button 
              onClick={() => {
                setLogs([]);
                agentHub.clearMessageLog();
              }}
              variant="outline"
              className="font-mono"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </Card>

        {/* System Health */}
        {systemHealth && (
          <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4 font-mono flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Health
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">Total Agents</p>
                <p className="text-2xl font-bold text-foreground">{systemHealth.totalAgents}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">Active</p>
                <p className="text-2xl font-bold text-success">{systemHealth.activeAgents}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">Idle</p>
                <p className="text-2xl font-bold text-primary">{systemHealth.idleAgents}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">Processing</p>
                <p className="text-2xl font-bold text-warning">{systemHealth.processingAgents}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">Errors</p>
                <p className="text-2xl font-bold text-destructive">{systemHealth.errorAgents}</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-mono mb-1">Queued Tasks</p>
                <p className="text-2xl font-bold text-accent">{systemHealth.totalQueuedTasks}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agents Status */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4 font-mono">Test Agents</h2>
            {agents.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No agents running</p>
                <p className="text-sm text-muted-foreground">Click "Run Full Test" to start</p>
              </div>
            ) : (
              <div className="space-y-4">
                {agents.map((agent, idx) => (
                  <div 
                    key={agent.agentId}
                    className="p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-xs text-muted-foreground font-mono">{agent.agentId}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          agent.status === 'idle' ? 'default' :
                          agent.status === 'processing' ? 'outline' :
                          agent.status === 'error' ? 'destructive' : 'default'
                        }
                        className={agent.status === 'processing' ? 'animate-pulse' : ''}
                      >
                        {agent.status === 'idle' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {agent.status === 'processing' && <Zap className="w-3 h-3 mr-1" />}
                        {agent.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {agent.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Queue</p>
                        <p className="text-lg font-bold">{agent.queueLength}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tasks</p>
                        <p className="text-lg font-bold">{agent.metrics.tasksProcessed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Success</p>
                        <p className="text-lg font-bold text-success">{agent.metrics.tasksSucceeded}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Failed</p>
                        <p className="text-lg font-bold text-destructive">{agent.metrics.tasksFailed}</p>
                      </div>
                    </div>

                    {agent.metrics.averageProcessingTime > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-mono">
                          Avg: {agent.metrics.averageProcessingTime}ms
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Test Logs */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4 font-mono">Test Logs</h2>
            <div className="bg-black/50 rounded-lg p-4 h-[500px] overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Run a test to see output.</p>
              ) : (
                logs.map((log, idx) => (
                  <div 
                    key={idx}
                    className={`mb-1 ${
                      log.includes('✅') ? 'text-success' :
                      log.includes('❌') ? 'text-destructive' :
                      log.includes('⏳') ? 'text-warning' :
                      log.includes('🚀') || log.includes('🎉') ? 'text-primary' :
                      'text-foreground'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Recent Messages */}
        {messages.length > 0 && (
          <Card className="p-6 mt-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4 font-mono">AgentHub Messages</h2>
            <div className="space-y-2">
              {messages.slice().reverse().map((msg, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-background/50 rounded-lg border border-border font-mono text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-primary font-semibold">{msg.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    From: {msg.fromAgent} {msg.toAgent && `→ ${msg.toAgent}`}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgentTest;
