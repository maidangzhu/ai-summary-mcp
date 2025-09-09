// 数据库服务模块
import { PrismaClient } from "@prisma/client";

import { ComprehensiveAnalysisResult, ProblemClassification } from './types.js';

// 创建Prisma客户端实例
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// 保存分析结果到数据库
export const saveAnalysisResult = async (
  result: ComprehensiveAnalysisResult,
  chatContent: string,
  filename?: string
): Promise<string> => {
  console.log('🗄️  开始保存分析结果到数据库...');
  console.log('📊 数据概览:', {
    filename,
    chatContentLength: chatContent.length,
    techStack: result.techStack?.primaryStack,
    businessDomain: result.business?.domain,
    problemsCount: result.problems?.length || 0,
    focusAreasCount: result.focusAreas?.length || 0
  });
  
  try {
    console.log('🔗 检查数据库连接状态...');
    await prisma.$connect();
    console.log('✅ 数据库连接正常');
    
    console.log('💾 创建分析结果记录...');
    // 创建分析结果记录
    const analysisResult = await prisma.analysisResult.create({
      data: {
        filename,
        chatContent,
        
        // 技术栈分析
        primaryStack: result.techStack?.primaryStack,
        secondaryStacks: result.techStack?.secondaryStacks || [],
        technologies: result.techStack?.technologies || [],
        frameworks: result.techStack?.frameworks || [],
        tools: result.techStack?.tools || [],
        techConfidence: result.techStack?.confidence,
        techReasoning: result.techStack?.reasoning,
        
        // 业务分析
        businessDomain: result.business?.domain,
        subDomains: result.business?.subDomains || [],
        businessGoals: result.business?.businessGoals || [],
        userTypes: result.business?.userTypes || [],
        valueProposition: result.business?.valueProposition,
        marketContext: result.business?.marketContext,
        businessConfidence: result.business?.confidence,
        businessReasoning: result.business?.reasoning,
        
        // 标签分析
        primaryTags: result.tags?.primaryTags?.map(tag => tag.toString()) || [],
        customTags: result.tags?.customTags || [],
        priority: result.tags?.priority,
        urgency: result.tags?.urgency,
        complexity: result.tags?.complexity,
        tagReasoning: result.tags?.reasoning,
        
        // AI思考分析
        keyQuestions: result.aiThoughts?.keyQuestions || [],
        reasoningProcess: result.aiThoughts?.reasoningProcess || [],
        assumptions: result.aiThoughts?.assumptions || [],
        alternatives: result.aiThoughts?.alternatives || [],
        recommendations: result.aiThoughts?.recommendations || [],
        uncertainties: result.aiThoughts?.uncertainties || [],
        aiThoughtReasoning: result.aiThoughts?.reasoning,
        
        // 解决方案分析
        problemsSolved: result.solutions?.problemsSolved || [],
        solutionApproaches: result.solutions?.solutionApproaches || [],
        implementationSteps: result.solutions?.implementationSteps || [],
        challenges: result.solutions?.challenges || [],
        outcomes: result.solutions?.outcomes || [],
        lessonsLearned: result.solutions?.lessonsLearned || [],
        solutionReasoning: result.solutions?.reasoning,
        
        // 总结分析
        keyPoints: result.summary?.keyPoints || [],
        mainAchievements: result.summary?.mainAchievements || [],
        nextSteps: result.summary?.nextSteps || [],
        actionItems: result.summary?.actionItems || [],
        decisions: result.summary?.decisions || [],
        risks: result.summary?.risks || [],
        opportunities: result.summary?.opportunities || [],
        summaryReasoning: result.summary?.reasoning,
        
        // 关注领域
        focusAreas: result.focusAreas,
        
        // 创建关联的问题分类
        problems: {
          create: (result.problems || []).map(problem => ({
            category: problem.category,
            subCategory: problem.subCategory,
            severity: problem.severity,
            complexity: problem.complexity,
            estimatedTime: problem.estimatedTime,
            tags: problem.tags,
            reasoning: problem.reasoning
          }))
        }
      },
      include: {
        problems: true
      }
    });
    
    console.log(`✅ 分析结果已保存到数据库`);
    console.log('📋 保存详情:', {
      id: analysisResult.id,
      createdAt: analysisResult.createdAt,
      problemsCreated: analysisResult.problems.length,
      filename: analysisResult.filename
    });
    
    return analysisResult.id;
  } catch (error) {
    console.error('❌ 保存分析结果到数据库时出错:', error);
    console.error('🔍 错误详细信息:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code,
      meta: (error as any)?.meta
    });
    
    // 尝试检查数据库连接
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ 数据库连接测试成功');
    } catch (connectionError) {
      console.error('❌ 数据库连接测试失败:', connectionError);
    }
    
    throw error;
  }
};

// 根据ID获取分析结果
export const getAnalysisResult = async (id: string) => {
  try {
    const result = await prisma.analysisResult.findUnique({
      where: { id },
      include: {
        problems: true
      }
    });
    return result;
  } catch (error) {
    console.error('❌ 获取分析结果时出错:', error);
    throw error;
  }
};

// 获取所有分析结果（分页）
export const getAllAnalysisResults = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      prisma.analysisResult.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          problems: true
        }
      }),
      prisma.analysisResult.count()
    ]);
    
    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('❌ 获取分析结果列表时出错:', error);
    throw error;
  }
};

// 根据技术栈搜索分析结果
export const searchByTechStack = async (techStack: string) => {
  try {
    const results = await prisma.analysisResult.findMany({
      where: {
        OR: [
          { primaryStack: { contains: techStack, mode: 'insensitive' } },
          { technologies: { has: techStack } },
          { frameworks: { has: techStack } }
        ]
      },
      include: {
        problems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return results;
  } catch (error) {
    console.error('❌ 按技术栈搜索时出错:', error);
    throw error;
  }
};

// 根据业务领域搜索分析结果
export const searchByBusinessDomain = async (domain: string) => {
  try {
    const results = await prisma.analysisResult.findMany({
      where: {
        businessDomain: { contains: domain, mode: 'insensitive' }
      },
      include: {
        problems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return results;
  } catch (error) {
    console.error('❌ 按业务领域搜索时出错:', error);
    throw error;
  }
};

// 删除分析结果
export const deleteAnalysisResult = async (id: string) => {
  try {
    await prisma.analysisResult.delete({
      where: { id }
    });
    console.log(`✅ 分析结果已删除，ID: ${id}`);
  } catch (error) {
    console.error('❌ 删除分析结果时出错:', error);
    throw error;
  }
};

// 关闭数据库连接
export const closeDatabaseConnection = async () => {
  await prisma.$disconnect();
};

// 导出Prisma客户端实例
export { prisma };