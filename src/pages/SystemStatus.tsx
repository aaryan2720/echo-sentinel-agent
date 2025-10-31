/**
 * System Status & Testing Dashboard
 * Comprehensive overview of all endpoints and testing tools
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Play, 
  Database, 
  Bot, 
  Video, 
  Globe,
  FileText,
  Zap,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EndpointStatus {
  name: string;
  path: string;
  description: string;
  status: 'online' | 'offline' | 'checking';
  type: 'frontend' | 'backend' | 'docs';
  icon: any;
  category: string;
}

export default function SystemStatusPage() {
  const navigate = useNavigate();
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    // Frontend Routes
    {
      name: 'URL Analysis',
      path: '/url-analysis',
      description: 'Social Media Deepfake Detection with yt-dlp integration',
      status: 'checking',
      type: 'frontend',
      icon: Globe,
      category: 'Main Features'
    },
    {
      name: 'Visual Agent Test',
      path: '/visual-test',
      description: 'Video analysis and deepfake detection testing',
      status: 'checking',
      type: 'frontend',
      icon: Video,
      category: 'Testing Tools'
    },
    {
      name: 'Database Test',
      path: '/db-test',
      description: 'Supabase database connection and operations',
      status: 'checking',
      type: 'frontend',
      icon: Database,
      category: 'Testing Tools'
    },
    {
      name: 'Agent Test',
      path: '/agent-test',
      description: 'Agent communication and coordination testing',
      status: 'checking',
      type: 'frontend',
      icon: Bot,
      category: 'Testing Tools'
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      description: 'Main monitoring dashboard with live feeds',
      status: 'checking',
      type: 'frontend',
      icon: Zap,
      category: 'Main Features'
    },
    {
      name: 'Settings',
      path: '/settings',
      description: 'System configuration and preferences',
      status: 'checking',
      type: 'frontend',
      icon: Settings,
      category: 'System'
    },
    
    // Backend APIs
    {
      name: 'API Documentation',
      path: 'http://localhost:8001/docs',
      description: 'FastAPI interactive documentation (Swagger UI)',
      status: 'checking',
      type: 'backend',
      icon: FileText,
      category: 'Backend APIs'
    },
    {
      name: 'ReDoc API',
      path: 'http://localhost:8001/redoc',
      description: 'Alternative API documentation (ReDoc)',
      status: 'checking',
      type: 'backend',
      icon: FileText,
      category: 'Backend APIs'
    },
    {
      name: 'Models Status',
      path: 'http://localhost:8001/api/models',
      description: 'VideoMAE model status and capabilities',
      status: 'checking',
      type: 'backend',
      icon: Bot,
      category: 'Backend APIs'
    },
    {
      name: 'Video Analysis API',
      path: 'http://localhost:8001/api/analyze/video-url',
      description: 'URL-based video analysis with yt-dlp',
      status: 'checking',
      type: 'backend',
      icon: Video,
      category: 'Backend APIs'
    }
  ]);

  const checkEndpointStatus = async (endpoint: EndpointStatus): Promise<'online' | 'offline' | 'checking'> => {
    try {
      if (endpoint.type === 'frontend') {
        // For frontend routes, just mark as online (they exist if we can navigate)
        return 'online';
      } else {
        // For backend endpoints, try to fetch
        const response = await fetch(endpoint.path, { 
          method: 'GET',
          mode: 'cors'
        });
        return response.ok ? 'online' : 'offline';
      }
    } catch (error) {
      return 'offline';
    }
  };

  useEffect(() => {
    const checkAllEndpoints = async () => {
      const updatedEndpoints = await Promise.all(
        endpoints.map(async (endpoint) => ({
          ...endpoint,
          status: await checkEndpointStatus(endpoint)
        }))
      );
      setEndpoints(updatedEndpoints);
    };

    checkAllEndpoints();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'checking':
        return <Badge className="bg-yellow-100 text-yellow-800">Checking...</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleNavigation = (endpoint: EndpointStatus) => {
    if (endpoint.type === 'frontend') {
      navigate(endpoint.path);
    } else {
      window.open(endpoint.path, '_blank');
    }
  };

  const categories = [...new Set(endpoints.map(e => e.category))];
  const onlineCount = endpoints.filter(e => e.status === 'online').length;
  const totalCount = endpoints.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">System Status & Testing Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive overview of all development tools, testing endpoints, and system status
        </p>
      </div>

      {/* Overall Status */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          <strong>System Status:</strong> {onlineCount}/{totalCount} endpoints online
          {onlineCount === totalCount ? " - All systems operational! 🎉" : " - Some services may be offline"}
        </AlertDescription>
      </Alert>

      {/* Categories */}
      {categories.map(category => {
        const categoryEndpoints = endpoints.filter(e => e.category === category);
        
        return (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryEndpoints.map((endpoint, index) => {
                const IconComponent = endpoint.icon;
                
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                        </div>
                        {getStatusIcon(endpoint.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(endpoint.status)}
                        <Badge variant="outline" className="text-xs">
                          {endpoint.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription>{endpoint.description}</CardDescription>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleNavigation(endpoint)}
                          size="sm"
                          className="flex-1"
                          disabled={endpoint.status === 'offline'}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {endpoint.type === 'frontend' ? 'Open' : 'Visit'}
                        </Button>
                        
                        {endpoint.type === 'backend' && (
                          <Button
                            onClick={() => window.open(endpoint.path, '_blank')}
                            size="sm"
                            variant="outline"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground font-mono">
                        {endpoint.path}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common development and testing shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/url-analysis')} className="bg-blue-600 hover:bg-blue-700">
              🎬 Test URL Analysis
            </Button>
            <Button onClick={() => navigate('/visual-test')} className="bg-purple-600 hover:bg-purple-700">
              🎥 Test Video Analysis
            </Button>
            <Button onClick={() => navigate('/db-test')} className="bg-green-600 hover:bg-green-700">
              🗄️ Test Database
            </Button>
            <Button onClick={() => window.open('http://localhost:8001/docs', '_blank')} variant="outline">
              📚 API Docs
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              📊 Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Development Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
              <span>✅ yt-dlp integration for YouTube, Instagram, Twitter, TikTok extraction</span>
            </div>
          </div>
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">FIXED</Badge>
              <span>✅ Conservative 75% confidence threshold to reduce false positives</span>
            </div>
          </div>
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">ENHANCED</Badge>
              <span>✅ VideoMAE model now uses correct 32-frame input</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}