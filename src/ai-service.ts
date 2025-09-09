// AI服务模块
import { AIProviderConfig, AIResponse } from './types.js';
import { getAIConfig } from './config.js';

// AI服务类
export class AIService {
  private config: AIProviderConfig;

  constructor(config?: AIProviderConfig) {
    this.config = config || {
      provider: 'deepseek',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 2000
    };
  }

  // 初始化配置
  async initialize(): Promise<void> {
    this.config = await getAIConfig();
  }

  // 调用AI API
  async callAPI(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages = [];
      
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt
      });

      const requestBody = {
        model: this.config.model || 'deepseek-chat',
        messages,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 2000
      };

      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`AI API请求失败: ${response.status} ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('调用AI API时出错:', error);
      throw error;
    }
  }

  // 获取API URL
  private getApiUrl(): string {
    if (this.config.baseUrl) {
      return this.config.baseUrl;
    }

    switch (this.config.provider) {
      case 'deepseek':
        return 'https://api.deepseek.com/v1/chat/completions';
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'claude':
        return 'https://api.anthropic.com/v1/messages';
      default:
        return this.config.baseUrl || 'https://api.deepseek.com/v1/chat/completions';
    }
  }

  // 获取请求头
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    switch (this.config.provider) {
      case 'deepseek':
      case 'openai':
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        break;
      case 'claude':
        headers['x-api-key'] = this.config.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        break;
      default:
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        break;
    }

    return headers;
  }

  // 批量调用API（并行处理）
  async batchCall(prompts: { prompt: string; systemPrompt?: string }[]): Promise<string[]> {
    const promises = prompts.map(({ prompt, systemPrompt }) => 
      this.callAPI(prompt, systemPrompt)
    );
    
    const results = await Promise.allSettled(promises);
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : '分析失败'
    );
  }

  // 流式调用（如果支持）
  async streamCall(prompt: string, systemPrompt?: string, onChunk?: (chunk: string) => void): Promise<string> {
    // 目前简化实现，直接调用普通API
    // 后续可以根据不同提供商实现真正的流式调用
    return this.callAPI(prompt, systemPrompt);
  }

  // 获取当前配置
  getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  // 更新配置
  updateConfig(config: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // 测试连接
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testPrompt = '请回复"连接成功"';
      const response = await this.callAPI(testPrompt);
      
      if (response && response.trim().length > 0) {
        return {
          success: true,
          message: `连接成功，AI响应: ${response.substring(0, 50)}...`
        };
      } else {
        return {
          success: false,
          message: 'AI响应为空'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  // 估算token数量（简化实现）
  estimateTokens(text: string): number {
    // 简化的token估算，实际应该根据不同模型使用不同的tokenizer
    return Math.ceil(text.length / 4);
  }

  // 检查是否超过token限制
  checkTokenLimit(text: string): { withinLimit: boolean; estimatedTokens: number; maxTokens: number } {
    const estimatedTokens = this.estimateTokens(text);
    const maxTokens = this.config.maxTokens || 2000;
    
    return {
      withinLimit: estimatedTokens <= maxTokens * 0.8, // 留20%余量
      estimatedTokens,
      maxTokens
    };
  }
}

// 创建默认AI服务实例
export const createAIService = async (): Promise<AIService> => {
  const service = new AIService();
  await service.initialize();
  return service;
};

// 导出单例实例
let aiServiceInstance: AIService | null = null;

export const getAIService = async (): Promise<AIService> => {
  if (!aiServiceInstance) {
    aiServiceInstance = await createAIService();
  }
  return aiServiceInstance;
};

// 重置AI服务实例（用于配置更新后）
export const resetAIService = (): void => {
  aiServiceInstance = null;
};