// MCP 服务器类型定义

// API 请求数据接口
export interface AnalysisRequest {
  chatContent: string;
  title?: string;
  docTitle?: string;
  docContent?: string;
  timestamp: string;
}

// API 响应接口
export interface AnalysisResponse {
  success: boolean;
  message?: string;
  id?: string;
  error?: string;
}

// MCP 工具参数接口
export interface BugSummaryArgs {
  chatContent: string;
  title?: string;
  docTitle?: string;
  docContent?: string;
}