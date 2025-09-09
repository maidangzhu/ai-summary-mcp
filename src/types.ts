// 类型定义文件

// 技术栈枚举
export enum TechStack {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  MOBILE = 'mobile',
  DEVOPS = 'devops',
  DATABASE = 'database',
  AI_ML = 'ai_ml',
  BLOCKCHAIN = 'blockchain',
  GAME_DEV = 'game_dev',
  EMBEDDED = 'embedded',
  TESTING = 'testing',
  DESIGN = 'design',
  OTHER = 'other'
}

// 问题分类枚举
export enum ProblemCategory {
  BUG_FIX = 'bug_fix',
  FEATURE_REQUEST = 'feature_request',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  ARCHITECTURE = 'architecture',
  CODE_REVIEW = 'code_review',
  DEPLOYMENT = 'deployment',
  LEARNING = 'learning',
  TROUBLESHOOTING = 'troubleshooting',
  OPTIMIZATION = 'optimization',
  INTEGRATION = 'integration',
  OTHER = 'other'
}

// 业务领域枚举
export enum BusinessDomain {
  E_COMMERCE = 'e_commerce',
  FINTECH = 'fintech',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  SOCIAL_MEDIA = 'social_media',
  PRODUCTIVITY = 'productivity',
  GAMING = 'gaming',
  IOT = 'iot',
  ENTERPRISE = 'enterprise',
  STARTUP = 'startup',
  OPEN_SOURCE = 'open_source',
  OTHER = 'other'
}

// 标签类型枚举
export enum TagType {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  LEARNING = 'learning',
  RESEARCH = 'research',
  PROTOTYPE = 'prototype',
  PRODUCTION = 'production',
  REFACTOR = 'refactor',
  OPTIMIZATION = 'optimization',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  BUG = 'bug',
  FEATURE = 'feature',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  DEPLOYMENT = 'deployment'
}

// 配置接口
export interface AIProviderConfig {
  provider: 'deepseek' | 'openai' | 'claude' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// 技术栈分析结果
export interface TechStackAnalysis {
  primaryStack: TechStack;
  secondaryStacks: TechStack[];
  technologies: string[];
  frameworks: string[];
  tools: string[];
  confidence: number;
  reasoning: string;
}

// 业务分析结果
export interface BusinessAnalysis {
  domain: BusinessDomain;
  subDomains: string[];
  businessGoals: string[];
  userTypes: string[];
  valueProposition: string;
  marketContext: string;
  confidence: number;
  reasoning: string;
}

// 标签分析结果
export interface TagAnalysis {
  primaryTags: TagType[];
  customTags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  reasoning: string;
}

// AI对话思考分析
export interface AIThoughtAnalysis {
  keyQuestions: string[];
  reasoningProcess: string[];
  assumptions: string[];
  alternatives: string[];
  recommendations: string[];
  uncertainties: string[];
  reasoning: string;
}

// 问题分类结果
export interface ProblemClassification {
  category: ProblemCategory;
  subCategory?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  estimatedTime: string;
  tags: string[];
  reasoning: string;
}

// 解决方案分析
export interface SolutionAnalysis {
  problemsSolved: string[];
  solutionApproaches: string[];
  implementationSteps: string[];
  challenges: string[];
  outcomes: string[];
  lessonsLearned: string[];
  reasoning: string;
}

// 总结分析
export interface SummaryAnalysis {
  keyPoints: string[];
  mainAchievements: string[];
  nextSteps: string[];
  actionItems: string[];
  decisions: string[];
  risks: string[];
  opportunities: string[];
  reasoning: string;
}

// 综合分析结果
export interface ComprehensiveAnalysisResult {
  techStack?: TechStackAnalysis;
  business?: BusinessAnalysis;
  tags?: TagAnalysis;
  aiThoughts?: AIThoughtAnalysis;
  problems?: ProblemClassification[];
  solutions?: SolutionAnalysis;
  summary?: SummaryAnalysis;
  focusAreas: string[];
}

// AI API响应接口
export interface AIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// 分析配置
export interface AnalysisConfig {
  enableTechStack: boolean;
  enableBusiness: boolean;
  enableTags: boolean;
  enableAIThoughts: boolean;
  enableProblems: boolean;
  enableSolutions: boolean;
  enableSummary: boolean;
  customPrompts?: {
    techStack?: string;
    business?: string;
    tags?: string;
    aiThoughts?: string;
    problems?: string;
    solutions?: string;
    summary?: string;
  };
}