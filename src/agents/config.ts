/**
 * Agent Configuration
 * 
 * Central configuration for all EchoBreaker agents
 */

export const agentConfig = {
  // Common settings
  common: {
    maxRetries: 3,
    defaultTimeout: 30000, // 30 seconds
    logLevel: (import.meta.env.VITE_AGENT_LOG_LEVEL || 'info') as 'info' | 'warn' | 'error',
  },

  // Visual Analysis Agent
  visualAnalysis: {
    agentId: 'visual-analysis-001',
    name: 'DeepFake Detector',
    type: 'visual-analysis',
    maxConcurrentTasks: 2,
    timeout: 45000, // 45 seconds for video processing
    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
    models: {
      deepfakeDetection: 'facebook/deepfake-detection',
      faceDetection: 'adrianbulat/face-alignment',
    },
    thresholds: {
      highConfidence: 0.90,
      mediumConfidence: 0.70,
      lowConfidence: 0.50,
    },
  },

  // Audio Analysis Agent
  audioAnalysis: {
    agentId: 'audio-analysis-001',
    name: 'Audio Analyzer',
    type: 'audio-analysis',
    maxConcurrentTasks: 3,
    timeout: 30000,
    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
    models: {
      audioClassification: 'facebook/wav2vec2-base',
      voiceVerification: 'pyannote/speaker-diarization',
    },
    thresholds: {
      syntheticConfidence: 0.85,
      voiceCloneConfidence: 0.80,
    },
  },

  // Network Analysis Agent
  networkAnalysis: {
    agentId: 'network-analysis-001',
    name: 'Network Mapper',
    type: 'network-analysis',
    maxConcurrentTasks: 5,
    timeout: 20000,
    algorithms: {
      communityDetection: 'louvain',
      clustering: 'dbscan',
    },
    thresholds: {
      botProbability: 0.75,
      coordinationThreshold: 0.80,
      minClusterSize: 3,
    },
  },

  // Content Ingestion Agent
  contentIngestion: {
    agentId: 'content-ingestion-001',
    name: 'Echo Monitor',
    type: 'content-ingestion',
    maxConcurrentTasks: 10,
    timeout: 15000,
    platforms: {
      twitter: {
        enabled: Boolean(import.meta.env.VITE_TWITTER_BEARER_TOKEN),
        apiKey: import.meta.env.VITE_TWITTER_BEARER_TOKEN || '',
        monitorInterval: 60000, // 1 minute
      },
      telegram: {
        enabled: Boolean(import.meta.env.VITE_TELEGRAM_BOT_TOKEN),
        botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
        monitorInterval: 30000, // 30 seconds
      },
      youtube: {
        enabled: Boolean(import.meta.env.VITE_YOUTUBE_API_KEY),
        apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
        monitorInterval: 120000, // 2 minutes
      },
      reddit: {
        enabled: Boolean(import.meta.env.VITE_REDDIT_CLIENT_ID),
        clientId: import.meta.env.VITE_REDDIT_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_REDDIT_CLIENT_SECRET || '',
        monitorInterval: 90000, // 90 seconds
      },
    },
    priorityScoring: {
      viralThreshold: 10000, // 10K+ reach
      urgentKeywords: ['flood', 'emergency', 'crisis', 'disaster'],
    },
  },

  // Agent Coordinator
  coordinator: {
    agentId: 'coordinator-001',
    name: 'Agent Coordinator',
    type: 'coordinator',
    maxConcurrentTasks: 20,
    timeout: 60000, // 1 minute for full workflow
    workflows: {
      videoAnalysis: ['visual-analysis', 'audio-analysis', 'network-analysis'],
      audioAnalysis: ['audio-analysis', 'network-analysis'],
      imageAnalysis: ['visual-analysis', 'network-analysis'],
      textAnalysis: ['network-analysis'],
    },
    aggregation: {
      minConfidenceForIncident: 0.75,
      severityThresholds: {
        critical: 0.90,
        high: 0.75,
        medium: 0.50,
      },
    },
  },

  // Human Review Router
  humanReview: {
    agentId: 'human-review-001',
    name: 'Review Router',
    type: 'human-review',
    maxConcurrentTasks: 50,
    timeout: 5000,
    thresholds: {
      autoApprove: 0.95,
      autoReject: 0.20,
      humanReviewMin: 0.20,
      humanReviewMax: 0.95,
    },
    priorityRules: {
      high: {
        minReach: 100000,
        minConfidence: 0.80,
      },
      medium: {
        minReach: 50000,
        minConfidence: 0.60,
      },
      low: {
        minReach: 0,
        minConfidence: 0.20,
      },
    },
    sla: {
      highPriority: 7200000, // 2 hours
      mediumPriority: 14400000, // 4 hours
      lowPriority: 86400000, // 24 hours
    },
  },
};

// Type exports for TypeScript
export type AgentConfig = typeof agentConfig;
export type VisualAnalysisConfig = typeof agentConfig.visualAnalysis;
export type AudioAnalysisConfig = typeof agentConfig.audioAnalysis;
export type NetworkAnalysisConfig = typeof agentConfig.networkAnalysis;
export type ContentIngestionConfig = typeof agentConfig.contentIngestion;
export type CoordinatorConfig = typeof agentConfig.coordinator;
export type HumanReviewConfig = typeof agentConfig.humanReview;
