import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// API 请求数据接口
interface AnalysisRequest {
  chatContent: string;
  title?: string;
  docTitle?: string;
  docContent?: string;
  timestamp: string;
}

// POST /api/analysis - 接收分析数据
export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    
    console.log('📥 收到分析请求:', {
      chatContentLength: body.chatContent?.length || 0,
      title: body.title || '未指定',
      docTitle: body.docTitle || '未指定',
      docContentLength: body.docContent?.length || 0,
      timestamp: body.timestamp
    });

    // 验证必需字段
    if (!body.chatContent) {
      return NextResponse.json(
        { 
          success: false, 
          error: '聊天内容不能为空' 
        },
        { status: 400 }
      );
    }

    // 如果提供了文档信息，先创建文档
    let docId: string | undefined;
    if (body.docTitle && body.docContent) {
      console.log('📄 创建技术文档...');
      const doc = await prisma.doc.create({
        data: {
          title: body.docTitle,
          content: body.docContent
        }
      });
      docId = doc.id;
      console.log(`✅ 技术文档创建成功，ID: ${docId}`);
    }

    // 创建分析结果记录
    console.log('💾 创建分析结果记录...');
    const analysisResult = await prisma.analysisResult.create({
      data: {
        title: body.title,
        chatContent: body.chatContent,
        docId,
        // 暂时先保存原始数据，后续可以在这里调用AI分析
        // 或者添加一个队列系统来异步处理
        primaryStack: null,
        business: null,
        tags: [],
        keyQuestions: [],
        summary: null,
      },
      include: {
        doc: true
      }
    });

    console.log(`✅ 分析结果已保存，ID: ${analysisResult.id}`);

    return NextResponse.json({
      success: true,
      message: '数据已成功接收并保存',
      id: analysisResult.id,
      docId: docId
    });

  } catch (error) {
    console.error('❌ 处理分析请求时出错:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// GET /api/analysis - 获取分析结果列表（可选，用于调试）
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
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

    return NextResponse.json({
      success: true,
      data: {
        results,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ 获取分析结果时出错:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}