#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

// DeepSeek API配置
const DEEPSEEK_API_KEY = 'sk-6dea10bd0c894324b9773f7e91a520c1';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 技术栈枚举
enum TechStack {
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
enum ProblemCategory {
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

// 类型定义
interface TechStackAnalysis {
  primaryStack: TechStack;
  secondaryStacks: TechStack[];
  technologies: string[];
  frameworks: string[];
  tools: string[];
  confidence: number;
  reasoning: string;
}

interface ProblemClassification {
  category: ProblemCategory;
  subCategory?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  estimatedTime: string;
  tags: string[];
  reasoning: string;
}

interface ChatSummaryResult {
  focusAreas: string[];
  thoughts: string[];
  solvedProblems: string[];
  techStackAnalysis?: TechStackAnalysis;
  problemClassifications?: ProblemClassification[];
  markdown: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// 创建MCP服务器
const server = new Server(
  {
    name: 'ai-collaboration-analyzer',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 调用DeepSeek API的函数
const callDeepSeekAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API请求失败: ${response.status} ${response.statusText}`);
    }

    const data: DeepSeekResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('调用DeepSeek API时出错:', error);
    throw error;
  }
};

// 技术栈识别函数
const analyzeTechStack = async (content: string): Promise<TechStackAnalysis> => {
  const prompt = `请分析以下内容中涉及的技术栈，并按照以下JSON格式返回：

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
    const response = await callDeepSeekAPI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('无法解析技术栈分析结果');
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
};

// 问题分类函数
const classifyProblems = async (content: string): Promise<ProblemClassification[]> => {
  const prompt = `请分析以下内容中的问题并进行分类，返回JSON数组格式：

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
    const response = await callDeepSeekAPI(prompt);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('问题分类失败:', error);
    return [];
  }
};

// 解析AI返回的结构化内容
const parseAIResponse = (content: string): ChatSummaryResult => {
  const lines = content.split('\n');
  const result: ChatSummaryResult = {
    focusAreas: [],
    thoughts: [],
    solvedProblems: [],
    markdown: '',
  };

  let currentSection = '';
  let markdownContent = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.includes('关注领域') || trimmedLine.includes('Focus Areas')) {
      currentSection = 'focusAreas';
      markdownContent += `## 关注的领域\n\n`;
    } else if (trimmedLine.includes('思考') || trimmedLine.includes('Thoughts')) {
      currentSection = 'thoughts';
      markdownContent += `\n## AI对话中的思考\n\n`;
    } else if (trimmedLine.includes('解决的问题') || trimmedLine.includes('Solved Problems')) {
      currentSection = 'solvedProblems';
      markdownContent += `\n## 解决了的问题\n\n`;
    } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || /^\d+\./.test(trimmedLine)) {
      const cleanItem = trimmedLine.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
      if (cleanItem && currentSection) {
        result[currentSection as keyof Omit<ChatSummaryResult, 'markdown' | 'techStackAnalysis' | 'problemClassifications'>].push(cleanItem);
        markdownContent += `- ${cleanItem}\n`;
      }
    } else if (trimmedLine) {
      markdownContent += `${trimmedLine}\n`;
    }
  }

  result.markdown = markdownContent;
  return result;
};

// 保存markdown文件
const saveMarkdownFile = async (content: string, filename?: string): Promise<string> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = filename || `analysis-${timestamp}.md`;
  const documentsDir = path.join(process.cwd(), '.trae', 'documents');
  
  try {
    // 确保目录存在
    await fs.mkdir(documentsDir, { recursive: true });
    const filePath = path.join(documentsDir, fileName);
    await fs.writeFile(filePath, content, 'utf-8');
    return filePath;
  } catch (error) {
    console.error('保存文件时出错:', error);
    throw error;
  }
};

// 生成技术栈分析的Markdown
const generateTechStackMarkdown = (analysis: TechStackAnalysis): string => {
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
};

// 生成问题分类的Markdown
const generateProblemClassificationMarkdown = (classifications: ProblemClassification[]): string => {
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
};

// 生成提炼聊天内容的提示词
const generatePrompt = (chatContent: string): string => {
  return `请分析以下聊天内容，并按照以下格式提炼信息：

聊天内容：
${chatContent}

请按以下结构分析并输出：

关注领域：
- [提炼出的关注领域1]
- [提炼出的关注领域2]
- [更多领域...]

AI对话中的思考：
- [重要的思考点1]
- [重要的思考点2]
- [更多思考...]

解决了的问题：
- [解决的问题1]
- [解决的问题2]
- [更多问题...]

请确保每个部分都有具体的内容，如果某个部分没有相关信息，请标注"暂无"。`;
};

// 注册工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'chat_summary',
        description: '分析聊天内容并生成包含关注领域、思考和解决问题的markdown总结',
        inputSchema: {
          type: 'object',
          properties: {
            chatContent: {
              type: 'string',
              description: '需要分析的聊天内容',
            },
            filename: {
              type: 'string',
              description: '可选的输出文件名（不包含扩展名）',
            },
          },
          required: ['chatContent'],
        },
      },
      {
        name: 'analyze_tech_stack',
        description: '分析内容中的技术栈，识别主要和次要技术栈、具体技术、框架和工具',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: '需要分析技术栈的内容',
            },
            filename: {
              type: 'string',
              description: '可选的输出文件名（不包含扩展名）',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'classify_problems',
        description: '对内容中的问题进行分类，包括问题类型、严重程度、复杂度和预估时间',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: '需要分析问题的内容',
            },
            filename: {
              type: 'string',
              description: '可选的输出文件名（不包含扩展名）',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'comprehensive_analysis',
        description: '综合分析：同时进行聊天总结、技术栈识别和问题分类的完整分析',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: '需要进行综合分析的内容',
            },
            filename: {
              type: 'string',
              description: '可选的输出文件名（不包含扩展名）',
            },
          },
          required: ['content'],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const content = (args?.chatContent || args?.content) as string | undefined;
    const filename = args?.filename as string | undefined;

    if (!content || content.trim().length === 0) {
      throw new Error('内容不能为空');
    }

    if (name === 'chat_summary') {
      // 生成提示词并调用DeepSeek API
      const prompt = generatePrompt(content);
      const aiResponse = await callDeepSeekAPI(prompt);
      
      // 解析AI响应
      const summaryResult = parseAIResponse(aiResponse);
      
      // 生成完整的markdown内容
      const timestamp = new Date().toLocaleString('zh-CN');
      const fullMarkdown = `# 聊天内容总结\n\n**生成时间**: ${timestamp}\n\n${summaryResult.markdown}\n\n---\n\n## 原始聊天内容\n\n\`\`\`\n${content}\n\`\`\``;
      
      // 保存文件
      const savedPath = await saveMarkdownFile(fullMarkdown, filename);
      
      return {
        content: [
          {
            type: 'text',
            text: `聊天内容分析完成！\n\n**关注的领域** (${summaryResult.focusAreas.length}个):\n${summaryResult.focusAreas.map(area => `• ${area}`).join('\n')}\n\n**AI对话中的思考** (${summaryResult.thoughts.length}个):\n${summaryResult.thoughts.map(thought => `• ${thought}`).join('\n')}\n\n**解决了的问题** (${summaryResult.solvedProblems.length}个):\n${summaryResult.solvedProblems.map(problem => `• ${problem}`).join('\n')}\n\n**文件已保存至**: ${savedPath}`,
          },
        ],
      };
    }

    if (name === 'analyze_tech_stack') {
      const techStackAnalysis = await analyzeTechStack(content);
      const markdown = generateTechStackMarkdown(techStackAnalysis);
      
      const timestamp = new Date().toLocaleString('zh-CN');
      const fullMarkdown = `# 技术栈分析报告\n\n**生成时间**: ${timestamp}\n\n${markdown}\n---\n\n## 原始内容\n\n\`\`\`\n${content}\n\`\`\``;
      
      const savedPath = await saveMarkdownFile(fullMarkdown, filename || 'tech-stack-analysis');
      
      return {
        content: [
          {
            type: 'text',
            text: `技术栈分析完成！\n\n**主要技术栈**: ${techStackAnalysis.primaryStack}\n**置信度**: ${(techStackAnalysis.confidence * 100).toFixed(1)}%\n**核心技术**: ${techStackAnalysis.technologies.join(', ') || '未识别'}\n**框架**: ${techStackAnalysis.frameworks.join(', ') || '未识别'}\n**工具**: ${techStackAnalysis.tools.join(', ') || '未识别'}\n\n**文件已保存至**: ${savedPath}`,
          },
        ],
      };
    }

    if (name === 'classify_problems') {
      const problemClassifications = await classifyProblems(content);
      const markdown = generateProblemClassificationMarkdown(problemClassifications);
      
      const timestamp = new Date().toLocaleString('zh-CN');
      const fullMarkdown = `# 问题分类报告\n\n**生成时间**: ${timestamp}\n\n${markdown}\n---\n\n## 原始内容\n\n\`\`\`\n${content}\n\`\`\``;
      
      const savedPath = await saveMarkdownFile(fullMarkdown, filename || 'problem-classification');
      
      return {
        content: [
          {
            type: 'text',
            text: `问题分类完成！\n\n**识别到的问题数量**: ${problemClassifications.length}\n\n${problemClassifications.map((p, i) => `**问题 ${i + 1}**: ${p.category} (${p.severity}严重程度, ${p.complexity}复杂度, 预估${p.estimatedTime})`).join('\n')}\n\n**文件已保存至**: ${savedPath}`,
          },
        ],
      };
    }

    if (name === 'comprehensive_analysis') {
      // 并行执行所有分析
      const [summaryPromise, techStackPromise, problemsPromise] = await Promise.allSettled([
        (async () => {
          const prompt = generatePrompt(content);
          const aiResponse = await callDeepSeekAPI(prompt);
          return parseAIResponse(aiResponse);
        })(),
        analyzeTechStack(content),
        classifyProblems(content)
      ]);

      const summaryResult = summaryPromise.status === 'fulfilled' ? summaryPromise.value : {
        focusAreas: [],
        thoughts: [],
        solvedProblems: [],
        markdown: '分析失败'
      };
      
      const techStackAnalysis = techStackPromise.status === 'fulfilled' ? techStackPromise.value : {
        primaryStack: TechStack.OTHER,
        secondaryStacks: [],
        technologies: [],
        frameworks: [],
        tools: [],
        confidence: 0,
        reasoning: '分析失败'
      };
      
      const problemClassifications = problemsPromise.status === 'fulfilled' ? problemsPromise.value : [];

      // 生成综合报告
      const timestamp = new Date().toLocaleString('zh-CN');
      const fullMarkdown = `# AI协作档案综合分析报告\n\n**生成时间**: ${timestamp}\n\n${summaryResult.markdown}\n${generateTechStackMarkdown(techStackAnalysis)}\n${generateProblemClassificationMarkdown(problemClassifications)}\n---\n\n## 原始内容\n\n\`\`\`\n${content}\n\`\`\``;
      
      const savedPath = await saveMarkdownFile(fullMarkdown, filename || 'comprehensive-analysis');
      
      return {
        content: [
          {
            type: 'text',
            text: `综合分析完成！\n\n## 📊 分析概览\n\n**关注领域**: ${summaryResult.focusAreas.length}个\n**思考要点**: ${summaryResult.thoughts.length}个\n**解决问题**: ${summaryResult.solvedProblems.length}个\n**主要技术栈**: ${techStackAnalysis.primaryStack} (${(techStackAnalysis.confidence * 100).toFixed(1)}%置信度)\n**识别问题**: ${problemClassifications.length}个\n\n**文件已保存至**: ${savedPath}`,
          },
        ],
      };
    }

    throw new Error(`未知的工具: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `处理请求时出错: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
const main = async (): Promise<void> => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AI协作档案分析器MCP服务器已启动');
};

// 错误处理
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

main().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});