import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  techStack: z.string().optional(),
  business: z.string().optional(),
  search: z.string().optional(),
})

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      techStack: searchParams.get('techStack') || undefined,
      business: searchParams.get('business') || undefined,
      search: searchParams.get('search') || undefined,
    })

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (query.techStack) {
      where.primaryStack = query.techStack
    }
    
    if (query.business) {
      where.business = query.business
    }
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { summary: { contains: query.search, mode: 'insensitive' } },
        { chatContent: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // 获取总数
    const total = await db.analysisResult.count({ where })

    // 获取分页数据
    const results = await db.analysisResult.findMany({
      where,
      include: {
        problems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const hasMore = skip + limit < total

    return NextResponse.json({
      success: true,
      data: {
        results,
        pagination: {
          page,
          limit,
          total,
          hasMore,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching analysis results:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取分析结果失败',
      },
      { status: 500 }
    )
  }
}