// Markdown生成器模块
import {
  TechStackAnalysis,
  BusinessAnalysis,
  TagAnalysis,
  AIThoughtAnalysis,
  ProblemClassification,
  SolutionAnalysis,
  SummaryAnalysis,
  ComprehensiveAnalysisResult
} from './types.js';

// Markdown生成器类
export class MarkdownGenerator {
  // 生成技术栈分析的Markdown
  generateTechStackMarkdown(analysis: TechStackAnalysis): string {
    return `## 🔧 技术栈分析

**主要技术栈**: ${analysis.primaryStack}
**置信度**: ${(analysis.confidence * 100).toFixed(1)}%

### 技术详情
- **核心技术**: ${analysis.technologies.join(', ') || '未识别'}
- **框架**: ${analysis.frameworks.join(', ') || '未识别'}
- **工具**: ${analysis.tools.join(', ') || '未识别'}
- **次要技术栈**: ${analysis.secondaryStacks.join(', ') || '无'}

**分析推理**: ${analysis.reasoning}

`;
  }

  // 生成业务分析的Markdown
  generateBusinessMarkdown(analysis: BusinessAnalysis): string {
    return `## 🏢 业务分析

**主要业务领域**: ${analysis.domain}
**置信度**: ${(analysis.confidence * 100).toFixed(1)}%

### 业务详情
- **子领域**: ${analysis.subDomains.join(', ') || '未识别'}
- **业务目标**: ${analysis.businessGoals.join(', ') || '未识别'}
- **用户类型**: ${analysis.userTypes.join(', ') || '未识别'}
- **价值主张**: ${analysis.valueProposition || '未识别'}
- **市场背景**: ${analysis.marketContext || '未识别'}

**分析推理**: ${analysis.reasoning}

`;
  }

  // 生成标签分析的Markdown
  generateTagsMarkdown(analysis: TagAnalysis): string {
    const priorityEmoji = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    }[analysis.priority];

    const urgencyEmoji = {
      low: '⏳',
      medium: '⏰',
      high: '🚨',
      immediate: '🔥'
    }[analysis.urgency];

    const complexityEmoji = {
      simple: '⭐',
      moderate: '⭐⭐',
      complex: '⭐⭐⭐',
      expert: '⭐⭐⭐⭐'
    }[analysis.complexity];

    return `## 🏷️ 标签分析

### 评估指标
- **优先级**: ${priorityEmoji} ${analysis.priority}
- **紧急程度**: ${urgencyEmoji} ${analysis.urgency}
- **复杂度**: ${complexityEmoji} ${analysis.complexity}

### 标签详情
- **主要标签**: ${analysis.primaryTags.join(', ') || '无'}
- **自定义标签**: ${analysis.customTags.join(', ') || '无'}

**分析推理**: ${analysis.reasoning}

`;
  }

  // 生成AI思考分析的Markdown
  generateAIThoughtsMarkdown(analysis: AIThoughtAnalysis): string {
    return `## 🤖 AI对话思考分析

### 关键问题
${analysis.keyQuestions.map(q => `- ${q}`).join('\n') || '- 暂无'}

### 推理过程
${analysis.reasoningProcess.map((step, index) => `${index + 1}. ${step}`).join('\n') || '1. 暂无'}

### 假设条件
${analysis.assumptions.map(a => `- ${a}`).join('\n') || '- 暂无'}

### 备选方案
${analysis.alternatives.map(alt => `- ${alt}`).join('\n') || '- 暂无'}

### 建议
${analysis.recommendations.map(rec => `- ${rec}`).join('\n') || '- 暂无'}

### 不确定性
${analysis.uncertainties.map(unc => `- ${unc}`).join('\n') || '- 暂无'}

**分析推理**: ${analysis.reasoning}

`;
  }

  // 生成问题分类的Markdown
  generateProblemsMarkdown(classifications: ProblemClassification[]): string {
    if (classifications.length === 0) {
      return `## 🔍 问题分类

暂无识别到的问题。

`;
    }

    let markdown = `## 🔍 问题分类

`;
    
    classifications.forEach((problem, index) => {
      const severityEmoji = {
        low: '🟢',
        medium: '🟡', 
        high: '🟠',
        critical: '🔴'
      }[problem.severity];
      
      const complexityEmoji = {
        simple: '⭐',
        moderate: '⭐⭐',
        complex: '⭐⭐⭐',
        expert: '⭐⭐⭐⭐'
      }[problem.complexity];

      markdown += `### 问题 ${index + 1}
`;
      markdown += `- **类别**: ${problem.category}${problem.subCategory ? ` (${problem.subCategory})` : ''}
`;
      markdown += `- **严重程度**: ${severityEmoji} ${problem.severity}
`;
      markdown += `- **复杂度**: ${complexityEmoji} ${problem.complexity}
`;
      markdown += `- **预估时间**: ${problem.estimatedTime}
`;
      markdown += `- **标签**: ${problem.tags.join(', ')}
`;
      markdown += `- **分析**: ${problem.reasoning}

`;
    });

    return markdown;
  }

  // 生成解决方案分析的Markdown
  generateSolutionsMarkdown(analysis: SolutionAnalysis): string {
    return `## 💡 解决方案分析

### 解决的问题
${analysis.problemsSolved.map(p => `- ${p}`).join('\n') || '- 暂无'}

### 解决方案方法
${analysis.solutionApproaches.map(s => `- ${s}`).join('\n') || '- 暂无'}

### 实施步骤
${analysis.implementationSteps.map((step, index) => `${index + 1}. ${step}`).join('\n') || '1. 暂无'}

### 遇到的挑战
${analysis.challenges.map(c => `- ${c}`).join('\n') || '- 暂无'}

### 结果
${analysis.outcomes.map(o => `- ${o}`).join('\n') || '- 暂无'}

### 经验教训
${analysis.lessonsLearned.map(l => `- ${l}`).join('\n') || '- 暂无'}

**分析推理**: ${analysis.reasoning}

`;
  }

  // 生成总结分析的Markdown
  generateSummaryMarkdown(analysis: SummaryAnalysis): string {
    return `## 📋 总结分析

### 关键要点
${analysis.keyPoints.map(p => `- ${p}`).join('\n') || '- 暂无'}

### 主要成就
${analysis.mainAchievements.map(a => `- ${a}`).join('\n') || '- 暂无'}

### 下一步行动
${analysis.nextSteps.map(s => `- ${s}`).join('\n') || '- 暂无'}

### 行动项
${analysis.actionItems.map(item => `- ${item}`).join('\n') || '- 暂无'}

### 决策
${analysis.decisions.map(d => `- ${d}`).join('\n') || '- 暂无'}

### 风险
${analysis.risks.map(r => `- ${r}`).join('\n') || '- 暂无'}

### 机会
${analysis.opportunities.map(o => `- ${o}`).join('\n') || '- 暂无'}

**分析推理**: ${analysis.reasoning}

`;
  }

  // 生成综合分析报告的Markdown
  generateComprehensiveMarkdown(result: ComprehensiveAnalysisResult, originalContent: string): string {
    const timestamp = new Date().toLocaleString('zh-CN');
    let markdown = `# AI协作档案综合分析报告

**生成时间**: ${timestamp}

`;

    // 添加概览
    markdown += this.generateOverviewMarkdown(result);

    // 添加各个分析模块
    if (result.techStack) {
      markdown += this.generateTechStackMarkdown(result.techStack);
    }

    if (result.business) {
      markdown += this.generateBusinessMarkdown(result.business);
    }

    if (result.tags) {
      markdown += this.generateTagsMarkdown(result.tags);
    }

    if (result.aiThoughts) {
      markdown += this.generateAIThoughtsMarkdown(result.aiThoughts);
    }

    if (result.problems && result.problems.length > 0) {
      markdown += this.generateProblemsMarkdown(result.problems);
    }

    if (result.solutions) {
      markdown += this.generateSolutionsMarkdown(result.solutions);
    }

    if (result.summary) {
      markdown += this.generateSummaryMarkdown(result.summary);
    }

    // 添加关注领域
    if (result.focusAreas.length > 0) {
      markdown += `## 🎯 关注领域

${result.focusAreas.map(area => `- ${area}`).join('\n')}

`;
    }

    // 添加原始内容
    markdown += `---

## 📄 原始内容

\`\`\`
${originalContent}
\`\`\``;

    return markdown;
  }

  // 生成概览的Markdown
  private generateOverviewMarkdown(result: ComprehensiveAnalysisResult): string {
    let overview = `## 📊 分析概览

`;

    const stats = [];

    if (result.techStack) {
      stats.push(`**技术栈**: ${result.techStack.primaryStack} (${(result.techStack.confidence * 100).toFixed(1)}%置信度)`);
    }

    if (result.business) {
      stats.push(`**业务领域**: ${result.business.domain} (${(result.business.confidence * 100).toFixed(1)}%置信度)`);
    }

    if (result.tags) {
      stats.push(`**优先级**: ${result.tags.priority} | **紧急程度**: ${result.tags.urgency} | **复杂度**: ${result.tags.complexity}`);
    }

    if (result.aiThoughts) {
      stats.push(`**关键问题**: ${result.aiThoughts.keyQuestions.length}个`);
      stats.push(`**推理步骤**: ${result.aiThoughts.reasoningProcess.length}个`);
      stats.push(`**建议**: ${result.aiThoughts.recommendations.length}个`);
    }

    if (result.problems) {
      stats.push(`**识别问题**: ${result.problems.length}个`);
    }

    if (result.solutions) {
      stats.push(`**解决问题**: ${result.solutions.problemsSolved.length}个`);
      stats.push(`**解决方案**: ${result.solutions.solutionApproaches.length}个`);
    }

    if (result.summary) {
      stats.push(`**关键要点**: ${result.summary.keyPoints.length}个`);
      stats.push(`**行动项**: ${result.summary.actionItems.length}个`);
    }

    stats.push(`**关注领域**: ${result.focusAreas.length}个`);

    overview += stats.join('\n') + '\n\n';

    return overview;
  }

  // 生成简化版报告
  generateSimpleReport(result: ComprehensiveAnalysisResult): string {
    let report = `# 快速分析报告\n\n`;

    // 关键信息
    if (result.techStack) {
      report += `**技术栈**: ${result.techStack.primaryStack}\n`;
    }

    if (result.business) {
      report += `**业务领域**: ${result.business.domain}\n`;
    }

    if (result.tags) {
      report += `**优先级**: ${result.tags.priority} | **复杂度**: ${result.tags.complexity}\n`;
    }

    if (result.problems && result.problems.length > 0) {
      report += `**主要问题**: ${result.problems[0].category}\n`;
    }

    // 关注领域（前5个）
    if (result.focusAreas.length > 0) {
      report += `\n**关注领域**:\n${result.focusAreas.slice(0, 5).map(area => `- ${area}`).join('\n')}\n`;
    }

    return report;
  }

  // 生成统计信息
  generateStatistics(result: ComprehensiveAnalysisResult): string {
    const stats = {
      techStackConfidence: result.techStack?.confidence || 0,
      businessConfidence: result.business?.confidence || 0,
      totalProblems: result.problems?.length || 0,
      totalSolutions: result.solutions?.problemsSolved.length || 0,
      totalFocusAreas: result.focusAreas.length,
      keyQuestions: result.aiThoughts?.keyQuestions.length || 0,
      recommendations: result.aiThoughts?.recommendations.length || 0,
      actionItems: result.summary?.actionItems.length || 0
    };

    return `## 📈 统计信息

- **技术栈置信度**: ${(stats.techStackConfidence * 100).toFixed(1)}%
- **业务分析置信度**: ${(stats.businessConfidence * 100).toFixed(1)}%
- **识别问题数**: ${stats.totalProblems}
- **解决方案数**: ${stats.totalSolutions}
- **关注领域数**: ${stats.totalFocusAreas}
- **关键问题数**: ${stats.keyQuestions}
- **建议数**: ${stats.recommendations}
- **行动项数**: ${stats.actionItems}

`;
  }

  // 生成Mermaid图表
  generateMermaidDiagram(result: ComprehensiveAnalysisResult): string {
    let diagram = `## 🔄 分析流程图

\`\`\`mermaid
graph TD
    A[原始内容] --> B[AI分析引擎]
    B --> C[技术栈分析]
    B --> D[业务分析]
    B --> E[标签分析]
    B --> F[AI思考分析]
    B --> G[问题分类]
    B --> H[解决方案分析]
    B --> I[总结分析]
    
    C --> J[综合报告]
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style J fill:#e8f5e8
\`\`\`

`;

    return diagram;
  }
}

// 创建默认Markdown生成器实例
export const createMarkdownGenerator = (): MarkdownGenerator => {
  return new MarkdownGenerator();
};

// 导出单例实例
let markdownGeneratorInstance: MarkdownGenerator | null = null;

export const getMarkdownGenerator = (): MarkdownGenerator => {
  if (!markdownGeneratorInstance) {
    markdownGeneratorInstance = new MarkdownGenerator();
  }
  return markdownGeneratorInstance;
};