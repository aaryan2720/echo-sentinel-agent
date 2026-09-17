import { useEffect, useState } from 'react';
import { supabase, getAgents, getIncidents, testConnection } from '@/lib/supabase';
import type { Agent, Incident } from '@/lib/supabase';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Database, RefreshCw, Layers, ShieldCheck, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DatabaseTest() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionTest, setConnectionTest] = useState<{ success: boolean; message: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const connTest = await testConnection();
      setConnectionTest(connTest);

      if (!connTest.success) {
        throw new Error(connTest.message);
      }

      const agentsData = await getAgents();
      setAgents(agentsData);

      const incidentsData = await getIncidents(5);
      setIncidents(incidentsData);
    } catch (err) {
      console.error('Database error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout
      title="Supabase Database Telemetry"
      subtitle="Verify PostgreSQL connection health, tables structure, and live row synchronization"
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Re-test Connection
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Connection Status Card */}
        <div className="soc-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">PostgreSQL Database Connectivity</h3>
                <p className="text-xs text-muted-foreground">Direct ping to Supabase REST & Realtime API</p>
              </div>
            </div>

            {loading ? (
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Pinging...
              </Badge>
            ) : error ? (
              <Badge variant="destructive" className="font-mono text-xs uppercase">
                Connection Failed
              </Badge>
            ) : (
              <Badge className="bg-success/20 text-success border-success/30 font-mono text-xs uppercase">
                Connected
              </Badge>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/25 space-y-2 text-xs text-destructive">
              <div className="font-bold flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Connection Error Message
              </div>
              <p className="font-mono">{error}</p>
            </div>
          )}

          {!error && !loading && connectionTest && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/25 text-xs text-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{connectionTest.message}</span>
            </div>
          )}
        </div>

        {/* Live Tables Data */}
        {!error && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agents Table */}
            <div className="soc-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" />
                  Agents Table ({agents.length} rows)
                </h3>
                <span className="text-xs text-muted-foreground font-mono">public.agents</span>
              </div>

              <div className="space-y-2">
                {agents.map((agent) => (
                  <div
                    key={agent.agent_id}
                    className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-foreground">{agent.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{agent.agent_type}</div>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Incidents Table */}
            <div className="soc-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-destructive" />
                  Incidents Table ({incidents.length} rows)
                </h3>
                <span className="text-xs text-muted-foreground font-mono">public.incidents</span>
              </div>

              <div className="space-y-2">
                {incidents.map((inc) => (
                  <div
                    key={inc.incident_id}
                    className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-foreground line-clamp-1">{inc.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">ID: {inc.incident_id}</div>
                    </div>
                    <Badge variant="destructive" className="font-mono text-[10px]">
                      {inc.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// EchoBreaker Sentinel (AI-03)
