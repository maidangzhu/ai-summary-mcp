// 分析器模块
import {
  TechStack,
  ProblemCategory,
  BusinessDomain,
  TagType,
  TechStackAnalysis,
  BusinessAnalysis,
  TagAnalysis,
  AIThoughtAnalysis,
  ProblemClassification,
  SummaryAnalysis,
  ComprehensiveAnalysisResult,
  AnalysisConfig
} from './types.js';
import { AIService } from './ai-service.js';
import { getAnalysisConfig } from './config.js';

// 分析器基类
abstract class BaseAnalyzer {
  protected aiService: AIService;
  protected config: AnalysisConfig;

  constructor(aiService: AIService, config: AnalysisConfig) {
    this.aiService = aiService;
    this.config = config;
  }

  // 解析JSON响应
  protected parseJSONResponse<T>(response: string, fallback: T): T {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return fallback;
    } catch (error) {
      console.error('JSON解析失败:', error);
      return fallback;
    }
  }
}

// 技术栈分析器
export class TechStackAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<TechStackAnalysis> {
    const prompt = this.config.customPrompts?.techStack || `请分析以下内容中涉及的主要技术栈，并按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "primaryStack": "主要技术栈类型(frontend/backend/mobile/devops/database/ai_ml/blockchain/game_dev/embedded/testing/design/other)"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        primaryStack: TechStack.OTHER
      });
    } catch (error) {
      console.error('技术栈分析失败:', error);
      return {
        primaryStack: TechStack.OTHER
      };
    }
  }
}

// 业务分析器
export class BusinessAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<BusinessAnalysis> {
    const prompt = this.config.customPrompts?.business || `请分析以下内容中涉及的业务领域，并按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "business": "业务领域描述"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        business: ''
      });
    } catch (error) {
      console.error('业务分析失败:', error);
      return {
        business: ''
      };
    }
  }
}

// 标签分析器
export class TagAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<TagAnalysis> {
    const prompt = this.config.customPrompts?.tags || `请分析以下内容并生成相关标签，按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "tags": ["标签列表"]
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        tags: []
      });
    } catch (error) {
      console.error('标签分析失败:', error);
      return {
        tags: []
      };
    }
  }
}

// AI思考分析器
export class AIThoughtAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<AIThoughtAnalysis> {
    const prompt = this.config.customPrompts?.aiThoughts || `请分析以下AI对话内容中的关键问题，按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "keyQuestions": ["关键问题列表"]
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        keyQuestions: []
      });
    } catch (error) {
      console.error('AI思考分析失败:', error);
      return {
        keyQuestions: []
      };
    }
  }
}

// 问题分类器
export class ProblemClassifier extends BaseAnalyzer {
  async analyze(content: string): Promise<ProblemClassification[]> {
    const prompt = this.config.customPrompts?.problems || `请分析以下内容中的问题并进行分类，返回JSON数组格式：

内容：
${content}

请为每个识别到的问题返回以下JSON格式：
[
  {
    "category": "问题类别(bug_fix/feature_request/performance/security/architecture/code_review/deployment/learning/troubleshooting/optimization/integration/other)",
    "subCategory": "子类别(可选)",
    "severity": "严重程度(low/medium/high/critical)",
    "complexity": "复杂度(simple/moderate/complex/expert)",
    "estimatedTime": "预估时间，如'2小时'、'1天'等",
    "tags": ["相关标签"],
    "reasoning": "分类推理"
  }
]`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, []);
    } catch (error) {
      console.error('问题分类失败:', error);
      return [];
    }
  }
}

// 总结分析器
export class SummaryAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<SummaryAnalysis> {
    const prompt = this.config.customPrompts?.summary || `请对以下内容进行总结，按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "summary": "内容总结"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        summary: ''
      });
    } catch (error) {
      console.error('总结分析失败:', error);
      return {
        summary: ''
      };
    }
  }
}

// 综合分析器
export class ComprehensiveAnalyzer {
  private aiService: AIService;
  private config: AnalysisConfig;
  private analyzers: {
    techStack: TechStackAnalyzer;
    business: BusinessAnalyzer;
    tags: TagAnalyzer;
    aiThoughts: AIThoughtAnalyzer;
    problems: ProblemClassifier;
    summary: SummaryAnalyzer;
  };

  constructor(aiService: AIService, config?: AnalysisConfig) {
    this.aiService = aiService;
    this.config = config || {
      enableTechStack: true,
      enableBusiness: true,
      enableTags: true,
      enableAIThoughts: true,
      enableProblems: true,
      enableSummary: true
    };

    // 初始化所有分析器
    this.analyzers = {
      techStack: new TechStackAnalyzer(aiService, this.config),
      business: new BusinessAnalyzer(aiService, this.config),
      tags: new TagAnalyzer(aiService, this.config),
      aiThoughts: new AIThoughtAnalyzer(aiService, this.config),
      problems: new ProblemClassifier(aiService, this.config),
      summary: new SummaryAnalyzer(aiService, this.config)
    };
  }

  // 执行综合分析
  async analyze(content: string): Promise<ComprehensiveAnalysisResult> {
    const analysisPromises: Promise<any>[] = [];
    const enabledAnalyses: string[] = [];

    // 根据配置启用相应的分析
    if (this.config.enableTechStack) {
      analysisPromises.push(this.analyzers.techStack.analyze(content));
      enabledAnalyses.push('techStack');
    }

    if (this.config.enableBusiness) {
      analysisPromises.push(this.analyzers.business.analyze(content));
      enabledAnalyses.push('business');
    }

    if (this.config.enableTags) {
      analysisPromises.push(this.analyzers.tags.analyze(content));
      enabledAnalyses.push('tags');
    }

    if (this.config.enableAIThoughts) {
      analysisPromises.push(this.analyzers.aiThoughts.analyze(content));
      enabledAnalyses.push('aiThoughts');
    }

    if (this.config.enableProblems) {
      analysisPromises.push(this.analyzers.problems.analyze(content));
      enabledAnalyses.push('problems');
    }

    if (this.config.enableSummary) {
      analysisPromises.push(this.analyzers.summary.analyze(content));
      enabledAnalyses.push('summary');
    }

    // 并行执行所有分析
    const results = await Promise.allSettled(analysisPromises);

    // 构建结果对象
    const analysisResult: ComprehensiveAnalysisResult = {};

    // 处理分析结果
    results.forEach((result, index) => {
      const analysisType = enabledAnalyses[index];
      if (result.status === 'fulfilled') {
        (analysisResult as any)[analysisType] = result.value;
      }
    });

    return analysisResult;
  }



  // 更新配置
  updateConfig(config: Partial<AnalysisConfig>): void {
    this.config = { ...this.config, ...config };
    
    // 更新所有分析器的配置
    Object.values(this.analyzers).forEach(analyzer => {
      (analyzer as any).config = this.config;
    });
  }
}

// 创建综合分析器实例
export const createComprehensiveAnalyzer = async (aiService: AIService): Promise<ComprehensiveAnalyzer> => {
  const config = await getAnalysisConfig();
  return new ComprehensiveAnalyzer(aiService, config);
};