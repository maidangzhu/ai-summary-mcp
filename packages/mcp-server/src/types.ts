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
}

// 业务分析结果
export interface BusinessAnalysis {
  business: string;
}

// 标签分析结果
export interface TagAnalysis {
  tags: string[];
}

// AI对话思考分析
export interface AIThoughtAnalysis {
  keyQuestions: string[];
}

// 问题分类结果
export interface ProblemClassification {
  category: ProblemCategory;
}

// 总结分析
export interface SummaryAnalysis {
  summary: string;
}

// 技术文档接口
export interface Doc {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 创建文档请求接口
export interface CreateDocRequest {
  title: string;
  content: string;
}

// 综合分析结果
export interface ComprehensiveAnalysisResult {
  techStack?: TechStackAnalysis;
  business?: BusinessAnalysis;
  tags?: TagAnalysis;
  aiThoughts?: AIThoughtAnalysis;
  problems?: ProblemClassification[];
  summary?: SummaryAnalysis;
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
  enableSummary: boolean;
  customPrompts?: {
    techStack?: string;
    business?: string;
    tags?: string;
    aiThoughts?: string;
    problems?: string;
    summary?: string;
  };
}