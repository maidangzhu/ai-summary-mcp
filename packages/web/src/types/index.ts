// 从Prisma schema导入的类型
export interface AnalysisResult {
  id: string
  createdAt: Date
  updatedAt: Date
  title?: string
  chatContent: string
  primaryStack?: string
  business?: string
  tags: string[]
  keyQuestions: string[]
  summary?: string
  problems: ProblemClassification[]
  doc?: Doc
  docId?: string
}

export interface Doc {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface ProblemClassification {
  id: string
  createdAt: Date
  analysisResultId: string
  category: string
}

// UI组件相关类型
export interface ProfileData {
  name: string
  title: string
  avatar: string
  bio: string
  location: string
  website?: string
  github?: string
  email?: string
}

export interface StatsData {
  totalProblems: number
  totalTechStacks: number
  totalBusinessDomains: number
  recentActivity: number
}

// API响应类型
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// 筛选和排序类型
export interface FilterOptions {
  techStack?: string
  business?: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SortOptions {
  field: 'createdAt' | 'updatedAt' | 'title'
  order: 'asc' | 'desc'
}

// 组件Props类型
export interface AnalysisCardProps {
  analysis: AnalysisResult
  className?: string
}

export interface ProfileCardProps {
  profile: ProfileData
  stats: StatsData
  className?: string
}

export interface MarkdownRendererProps {
  content: string
  className?: string
}

export interface TagProps {
  tag: string
  variant?: 'default' | 'tech' | 'business' | 'problem'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// 常量类型
export const TECH_STACKS = [
  '前端', '后端', '移动端', 'DevOps', '数据库', 'AI/ML',
  '区块链', '游戏开发', '嵌入式', '测试', '设计', '其他'
] as const

export const BUSINESS_DOMAINS = [
  '电商', '金融科技', '医疗健康', '教育', '娱乐', '社交媒体',
  '生产力工具', '游戏', '物联网', '企业级', '创业', '开源', '其他'
] as const

export const PROBLEM_CATEGORIES = [
  'Bug修复', '功能需求', '性能优化', '安全问题', '文档问题',
  '配置问题', '集成问题', '测试问题', '部署问题', '架构问题',
  '代码审查', '其他'
] as const

export type TechStack = typeof TECH_STACKS[number]
export type BusinessDomain = typeof BUSINESS_DOMAINS[number]
export type ProblemCategory = typeof PROBLEM_CATEGORIES[number]