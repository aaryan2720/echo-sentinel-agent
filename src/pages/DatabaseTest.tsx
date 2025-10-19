import { useEffect, useState } from 'react'
import { supabase, getAgents, getIncidents, testConnection } from '@/lib/supabase'
import type { Agent, Incident } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2, Database, RefreshCw } from 'lucide-react'

export default function DatabaseTest() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionTest, setConnectionTest] = useState<{ success: boolean; message: string } | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Test connection first
      const connTest = await testConnection()
      setConnectionTest(connTest)

      if (!connTest.success) {
        throw new Error(connTest.message)
      }

      // Fetch agents
      const agentsData = await getAgents()
      setAgents(agentsData)

      // Fetch incidents
      const incidentsData = await getIncidents(5)
      setIncidents(incidentsData)

      setLoading(false)
    } catch (err) {
      console.error('Database error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-mono">Connecting to Supabase...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className="max-w-2xl w-full border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-destructive" />
              <CardTitle className="text-destructive">Database Connection Failed</CardTitle>
            </div>
            <CardDescription>Unable to connect to Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/10 p-4 rounded-lg mb-4">
              <p className="text-sm text-destructive font-mono">{error}</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold">Troubleshooting steps:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
                <li>Verify your Supabase project is running</li>
                <li>Ensure you've run all 3 SQL migrations (schema, RLS, seed data)</li>
                <li>Restart your dev server after changing .env</li>
              </ul>
            </div>
            <Button onClick={fetchData} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-mono text-primary flex items-center gap-3">
                <Database className="w-10 h-10" />
                Database Connection Test
              </h1>
              <p className="text-muted-foreground">Testing Supabase connection and data retrieval</p>
            </div>
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {connectionTest && (
          <Card className={`mb-8 ${connectionTest.success ? 'border-green-500' : 'border-destructive'}`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {connectionTest.success ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <CardTitle>Connection Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`font-mono ${connectionTest.success ? 'text-green-500' : 'text-destructive'}`}>
                {connectionTest.message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Agents Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-mono">
              AI Agents ({agents.length})
            </CardTitle>
            <CardDescription>
              All agents fetched from the 'agents' table
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No agents found. Did you run the seed data migration?
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                  <Card key={agent.id} className="bg-card/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <Badge
                          variant={
                            agent.status === 'processing'
                              ? 'default'
                              : agent.status === 'complete'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            agent.status === 'processing'
                              ? 'bg-blue-600 animate-pulse'
                              : agent.status === 'complete'
                              ? 'bg-green-600'
                              : ''
                          }
                        >
                          {agent.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Type: {agent.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {agent.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Tasks Completed:</span>
                          <span className="font-bold">{agent.tasks_completed}</span>
                        </div>
                        {agent.current_task && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Current Task:</span>
                            <p className="text-blue-400 mt-1 animate-pulse">• {agent.current_task}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incidents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">
              Recent Incidents ({incidents.length})
            </CardTitle>
            <CardDescription>
              Latest incidents fetched from the 'incidents' table
            </CardDescription>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No incidents found. Did you run the seed data migration?
              </p>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <Card key={incident.id} className="bg-card/50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {incident.incident_id}
                        </Badge>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              incident.severity === 'critical'
                                ? 'destructive'
                                : incident.severity === 'high'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {incident.severity}
                          </Badge>
                          <Badge
                            variant={incident.status === 'active' ? 'default' : 'outline'}
                            className={incident.status === 'active' ? 'bg-green-600' : ''}
                          >
                            {incident.status}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{incident.title}</CardTitle>
                      <CardDescription>{incident.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Confidence</p>
                          <p className="font-bold text-primary">{incident.confidence_score}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Accounts</p>
                          <p className="font-bold">{incident.accounts_involved}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Reach</p>
                          <p className="font-bold text-accent">{incident.reach_estimate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Evidence</p>
                          <p className="font-bold">{incident.evidence_count}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap mt-4">
                        {incident.platform.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card className="mt-8 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-bold text-lg text-green-500">✅ Database Connection Successful!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supabase is working correctly. You can now connect your components to the database.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
