// 数据库服务模块
import prisma from "./db";

import { ComprehensiveAnalysisResult } from './types.js';

// 使用共享 Prisma 客户端实例

// 创建技术文档
export const createDoc = async (
  title: string,
  content: string
): Promise<string> => {
  console.log('📄 开始创建技术文档...');
  console.log('📋 文档信息:', {
    title,
    contentLength: content.length
  });
  
  try {
    console.log('🔗 检查数据库连接状态...');
    await prisma.$connect();
    console.log('✅ 数据库连接正常');
    
    console.log('💾 创建文档记录...');
    const doc = await prisma.doc.create({
      data: {
        title,
        content
      }
    });
    
    console.log(`✅ 技术文档已创建`);
    console.log('📋 文档详情:', {
      id: doc.id,
      title: doc.title,
      createdAt: doc.createdAt
    });
    
    return doc.id;
  } catch (error) {
    console.error('❌ 创建技术文档时出错:', error);
    console.error('🔍 错误详细信息:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code,
      meta: (error as any)?.meta
    });
    
    throw error;
  }
};

// 保存分析结果到数据库
export const saveAnalysisResult = async (
  result: ComprehensiveAnalysisResult,
  chatContent: string,
  title?: string,
  docTitle?: string,
  docContent?: string
): Promise<string> => {
  console.log('🗄️  开始保存分析结果到数据库...');
  console.log('📊 数据概览:', {
    title,
    chatContentLength: chatContent.length,
    techStack: result.techStack?.primaryStack,
    business: result.business?.business,
    problemsCount: result.problems?.length || 0,
    hasDoc: !!(docTitle && docContent)
  });
  
  try {
    console.log('🔗 检查数据库连接状态...');
    await prisma.$connect();
    console.log('✅ 数据库连接正常');
    
    // 如果提供了文档信息，先创建文档
    let docId: string | undefined;
    if (docTitle && docContent) {
      console.log('📄 创建关联的技术文档...');
      docId = await createDoc(docTitle, docContent);
      console.log(`✅ 技术文档创建成功，ID: ${docId}`);
    }
    
    console.log('💾 创建分析结果记录...');
    // 创建分析结果记录
    const analysisResult = await prisma.analysisResult.create({
      data: {
        title,
        chatContent,
        
        // 关联的技术文档ID
        docId,
        
        // 技术栈分析
        primaryStack: result.techStack?.primaryStack,
        
        // 业务分析
        business: result.business?.business,
        
        // 标签分析
        tags: result.tags?.tags || [],
        
        // AI思考分析
        keyQuestions: result.aiThoughts?.keyQuestions || [],
        
        // 总结
        summary: result.summary?.summary,
        
        // 创建关联的问题分类
        problems: {
          create: (result.problems || []).map(problem => ({
            category: problem.category
          }))
        }
      },
      include: {
        problems: true,
        doc: true
      }
    });
    
    console.log(`✅ 分析结果已保存到数据库`);
    console.log('📋 保存详情:', {
      id: analysisResult.id,
      createdAt: analysisResult.createdAt,
      problemsCreated: analysisResult.problems.length,
      title: analysisResult.title,
      docId: analysisResult.docId,
      docTitle: analysisResult.doc?.title
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

// 根据ID获取技术文档
export const getDoc = async (id: string) => {
  try {
    const doc = await prisma.doc.findUnique({
      where: { id },
      include: {
        analysisResults: {
          include: {
            problems: true
          }
        }
      }
    });
    return doc;
  } catch (error) {
    console.error('❌ 获取技术文档时出错:', error);
    throw error;
  }
};

// 获取所有技术文档（分页）
export const getAllDocs = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      prisma.doc.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          analysisResults: {
            include: {
              problems: true
            }
          }
        }
      }),
      prisma.doc.count()
    ]);
    
    return {
      docs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('❌ 获取技术文档列表时出错:', error);
    throw error;
  }
};

// 根据标题搜索技术文档
export const searchDocsByTitle = async (title: string) => {
  try {
    const docs = await prisma.doc.findMany({
      where: {
        title: { contains: title, mode: 'insensitive' }
      },
      include: {
        analysisResults: {
          include: {
            problems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return docs;
  } catch (error) {
    console.error('❌ 按标题搜索技术文档时出错:', error);
    throw error;
  }
};

// 删除技术文档
export const deleteDoc = async (id: string) => {
  try {
    await prisma.doc.delete({
      where: { id }
    });
    console.log(`✅ 技术文档已删除，ID: ${id}`);
  } catch (error) {
    console.error('❌ 删除技术文档时出错:', error);
    throw error;
  }
};

// 根据ID获取分析结果
export const getAnalysisResult = async (id: string) => {
  try {
    const result = await prisma.analysisResult.findUnique({
      where: { id },
      include: {
        problems: true,
        doc: true
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
          problems: true,
          doc: true
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
        primaryStack: { contains: techStack, mode: 'insensitive' }
      },
      include: {
        problems: true,
        doc: true
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
export const searchByBusiness = async (business: string) => {
  try {
    const results = await prisma.analysisResult.findMany({
      where: {
        business: { contains: business, mode: 'insensitive' }
      },
      include: {
        problems: true,
        doc: true
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