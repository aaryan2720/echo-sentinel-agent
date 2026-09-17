/**
 * Main API Service for connecting Frontend to Backend
 * Connects to the Python FastAPI backend
 */

// Types for API responses
export interface Incident {
  id: string;
  title: string;
  confidence: number;
  verdict: 'REAL' | 'FAKE';
  timestamp: string;
  platform: string;
  network_size: number;
  status: string;
  description: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  status: string;
  confidence: number;
}

export interface Agent {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'error';
  accuracy: number;
  tasks_completed: number;
  last_activity: string;
  current_task: string;
  performance: {
    precision: number;
    recall: number;
  };
}

export interface Stats {
  total_incidents: number;
  active_alerts: number;
  networks_detected: number;
  accuracy_rate: number;
  processing_speed: string;
  platforms_monitored: number;
  last_24h: {
    incidents: number;
    alerts: number;
    content_analyzed: number;
  };
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface AnalysisResult {
  verdict: 'REAL' | 'FAKE';
  confidence: number;
  processing_time: number;
  model: string;
  frame_count?: number;
  probabilities: {
    fake: number;
    real: number;
  };
}

class APIService {
  private baseUrl: string;

  constructor() {
    // Backend URL - adjust port if needed
    this.baseUrl = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';
  }

  // Helper method for making requests
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async checkHealth(): Promise<{ status: string; models: any; gpu_enabled: boolean }> {
    return this.request('/health');
  }

  // Get all incidents
  async getIncidents(): Promise<Incident[]> {
    return this.request('/api/incidents');
  }

  // Get all alerts
  async getAlerts(): Promise<Alert[]> {
    return this.request('/api/alerts');
  }

  // Get all agents
  async getAgents(): Promise<Agent[]> {
    return this.request('/api/agents');
  }

  // Get dashboard stats
  async getStats(): Promise<Stats> {
    return this.request('/api/stats');
  }

  // Analyze video file
  async analyzeVideo(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/api/analyze/video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Video analysis failed:', error);
      throw error;
    }
  }

  // Analyze video from URL
  async analyzeVideoUrl(url: string): Promise<AnalysisResult> {
    return this.request('/api/analyze/video-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // Get model information
  async getModels(): Promise<any> {
    return this.request('/api/models');
  }

  // Connection test
  async testConnection(): Promise<boolean> {
    try {
      await this.checkHealth();
      console.log('✅ Backend connection successful');
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const api = new APIService();
export default api;