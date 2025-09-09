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
  SolutionAnalysis,
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
    const prompt = this.config.customPrompts?.techStack || `请分析以下内容中涉及的技术栈，并按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "primaryStack": "主要技术栈类型(frontend/backend/mobile/devops/database/ai_ml/blockchain/game_dev/embedded/testing/design/other)",
  "secondaryStacks": ["次要技术栈类型数组"],
  "technologies": ["具体技术列表，如JavaScript, Python等"],
  "frameworks": ["框架列表，如React, Django等"],
  "tools": ["工具列表，如Git, Docker等"],
  "confidence": 0.85,
  "reasoning": "分析推理过程"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        primaryStack: TechStack.OTHER,
        secondaryStacks: [],
        technologies: [],
        frameworks: [],
        tools: [],
        confidence: 0,
        reasoning: '分析失败'
      });
    } catch (error) {
      console.error('技术栈分析失败:', error);
      return {
        primaryStack: TechStack.OTHER,
        secondaryStacks: [],
        technologies: [],
        frameworks: [],
        tools: [],
        confidence: 0,
        reasoning: '分析失败'
      };
    }
  }
}

// 业务分析器
export class BusinessAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<BusinessAnalysis> {
    const prompt = this.config.customPrompts?.business || `请分析以下内容中涉及的业务领域和商业背景，并按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "domain": "主要业务领域(e_commerce/fintech/healthcare/education/entertainment/social_media/productivity/gaming/iot/enterprise/startup/open_source/other)",
  "subDomains": ["子领域列表"],
  "businessGoals": ["业务目标列表"],
  "userTypes": ["用户类型列表"],
  "valueProposition": "价值主张描述",
  "marketContext": "市场背景描述",
  "confidence": 0.85,
  "reasoning": "分析推理过程"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        domain: BusinessDomain.OTHER,
        subDomains: [],
        businessGoals: [],
        userTypes: [],
        valueProposition: '',
        marketContext: '',
        confidence: 0,
        reasoning: '分析失败'
      });
    } catch (error) {
      console.error('业务分析失败:', error);
      return {
        domain: BusinessDomain.OTHER,
        subDomains: [],
        businessGoals: [],
        userTypes: [],
        valueProposition: '',
        marketContext: '',
        confidence: 0,
        reasoning: '分析失败'
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
  "primaryTags": ["主要标签类型(urgent/important/learning/research/prototype/production/refactor/optimization/security/performance/bug/feature/documentation/testing/deployment)"],
  "customTags": ["自定义标签列表"],
  "priority": "优先级(low/medium/high/critical)",
  "urgency": "紧急程度(low/medium/high/immediate)",
  "complexity": "复杂度(simple/moderate/complex/expert)",
  "reasoning": "标签分析推理"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        primaryTags: [],
        customTags: [],
        priority: 'medium',
        urgency: 'medium',
        complexity: 'moderate',
        reasoning: '分析失败'
      });
    } catch (error) {
      console.error('标签分析失败:', error);
      return {
        primaryTags: [],
        customTags: [],
        priority: 'medium',
        urgency: 'medium',
        complexity: 'moderate',
        reasoning: '分析失败'
      };
    }
  }
}

// AI思考分析器
export class AIThoughtAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<AIThoughtAnalysis> {
    const prompt = this.config.customPrompts?.aiThoughts || `请分析以下AI对话内容中的思考过程和提问，按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "keyQuestions": ["关键问题列表"],
  "reasoningProcess": ["推理过程步骤"],
  "assumptions": ["假设条件列表"],
  "alternatives": ["备选方案列表"],
  "recommendations": ["建议列表"],
  "uncertainties": ["不确定性列表"],
  "reasoning": "思考分析推理"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        keyQuestions: [],
        reasoningProcess: [],
        assumptions: [],
        alternatives: [],
        recommendations: [],
        uncertainties: [],
        reasoning: '分析失败'
      });
    } catch (error) {
      console.error('AI思考分析失败:', error);
      return {
        keyQuestions: [],
        reasoningProcess: [],
        assumptions: [],
        alternatives: [],
        recommendations: [],
        uncertainties: [],
        reasoning: '分析失败'
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

// 解决方案分析器
export class SolutionAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<SolutionAnalysis> {
    const prompt = this.config.customPrompts?.solutions || `请分析以下内容中解决的问题和采用的解决方案，按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "problemsSolved": ["解决的问题列表"],
  "solutionApproaches": ["解决方案方法列表"],
  "implementationSteps": ["实施步骤列表"],
  "challenges": ["遇到的挑战列表"],
  "outcomes": ["结果列表"],
  "lessonsLearned": ["经验教训列表"],
  "reasoning": "解决方案分析推理"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        problemsSolved: [],
        solutionApproaches: [],
        implementationSteps: [],
        challenges: [],
        outcomes: [],
        lessonsLearned: [],
        reasoning: '分析失败'
      });
    } catch (error) {
      console.error('解决方案分析失败:', error);
      return {
        problemsSolved: [],
        solutionApproaches: [],
        implementationSteps: [],
        challenges: [],
        outcomes: [],
        lessonsLearned: [],
        reasoning: '分析失败'
      };
    }
  }
}

// 总结分析器
export class SummaryAnalyzer extends BaseAnalyzer {
  async analyze(content: string): Promise<SummaryAnalysis> {
    const prompt = this.config.customPrompts?.summary || `请对以下内容进行总结分析，按照以下JSON格式返回：

内容：
${content}

请返回JSON格式的分析结果：
{
  "keyPoints": ["关键要点列表"],
  "mainAchievements": ["主要成就列表"],
  "nextSteps": ["下一步行动列表"],
  "actionItems": ["行动项列表"],
  "decisions": ["决策列表"],
  "risks": ["风险列表"],
  "opportunities": ["机会列表"],
  "reasoning": "总结分析推理"
}`;

    try {
      const response = await this.aiService.callAPI(prompt);
      return this.parseJSONResponse(response, {
        keyPoints: [],
        mainAchievements: [],
        nextSteps: [],
        actionItems: [],
        decisions: [],
        risks: [],
        opportunities: [],
        reasoning: '分析失败'
      });
    } catch (error) {
      console.error('总结分析失败:', error);
      return {
        keyPoints: [],
        mainAchievements: [],
        nextSteps: [],
        actionItems: [],
        decisions: [],
        risks: [],
        opportunities: [],
        reasoning: '分析失败'
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
    solutions: SolutionAnalyzer;
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
      enableSolutions: true,
      enableSummary: true
    };

    // 初始化所有分析器
    this.analyzers = {
      techStack: new TechStackAnalyzer(aiService, this.config),
      business: new BusinessAnalyzer(aiService, this.config),
      tags: new TagAnalyzer(aiService, this.config),
      aiThoughts: new AIThoughtAnalyzer(aiService, this.config),
      problems: new ProblemClassifier(aiService, this.config),
      solutions: new SolutionAnalyzer(aiService, this.config),
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

    if (this.config.enableSolutions) {
      analysisPromises.push(this.analyzers.solutions.analyze(content));
      enabledAnalyses.push('solutions');
    }

    if (this.config.enableSummary) {
      analysisPromises.push(this.analyzers.summary.analyze(content));
      enabledAnalyses.push('summary');
    }

    // 并行执行所有分析
    const results = await Promise.allSettled(analysisPromises);

    // 构建结果对象
    const analysisResult: ComprehensiveAnalysisResult = {
      focusAreas: [],
      markdown: ''
    };

    // 处理分析结果
    results.forEach((result, index) => {
      const analysisType = enabledAnalyses[index];
      if (result.status === 'fulfilled') {
        (analysisResult as any)[analysisType] = result.value;
      }
    });

    // 提取关注领域
    this.extractFocusAreas(analysisResult);

    return analysisResult;
  }

  // 提取关注领域
  private extractFocusAreas(result: ComprehensiveAnalysisResult): void {
    const focusAreas = new Set<string>();

    // 从技术栈分析中提取
    if (result.techStack) {
      focusAreas.add(`技术栈: ${result.techStack.primaryStack}`);
      result.techStack.technologies.forEach(tech => focusAreas.add(`技术: ${tech}`));
    }

    // 从业务分析中提取
    if (result.business) {
      focusAreas.add(`业务领域: ${result.business.domain}`);
      result.business.businessGoals.forEach(goal => focusAreas.add(`业务目标: ${goal}`));
    }

    // 从标签分析中提取
    if (result.tags) {
      result.tags.primaryTags.forEach(tag => focusAreas.add(`标签: ${tag}`));
      result.tags.customTags.forEach(tag => focusAreas.add(`自定义标签: ${tag}`));
    }

    // 从问题分类中提取
    if (result.problems) {
      result.problems.forEach(problem => focusAreas.add(`问题类型: ${problem.category}`));
    }

    result.focusAreas = Array.from(focusAreas);
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