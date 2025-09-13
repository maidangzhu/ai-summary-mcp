import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const GET = async () => {
  try {
    // 获取总问题数
    const totalProblems = await db.analysisResult.count()

    // 获取技术栈统计
    const techStackStats = await db.analysisResult.groupBy({
      by: ['primaryStack'],
      _count: {
        primaryStack: true,
      },
      where: {
        primaryStack: {
          not: null,
        },
      },
    })

    // 获取业务领域统计
    const businessStats = await db.analysisResult.groupBy({
      by: ['business'],
      _count: {
        business: true,
      },
      where: {
        business: {
          not: null,
        },
      },
    })

    // 获取最近30天的活动
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentActivity = await db.analysisResult.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // 获取问题分类统计
    const problemStats = await db.problemClassification.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    })

    // 获取最近的分析结果
    const recentAnalysis = await db.analysisResult.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        primaryStack: true,
        business: true,
        createdAt: true,
      },
    })

    // 计算月度趋势
    const monthlyTrend = await db.analysisResult.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // 按月份聚合数据
    const monthlyData = monthlyTrend.reduce((acc: Record<string, number>, item) => {
      const month = item.createdAt.toISOString().slice(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + item._count.id
      return acc
    }, {})

    const stats = {
      overview: {
        totalProblems,
        totalTechStacks: techStackStats.length,
        totalBusinessDomains: businessStats.length,
        recentActivity,
      },
      techStacks: techStackStats.map(item => ({
        name: item.primaryStack,
        count: item._count.primaryStack,
      })),
      businessDomains: businessStats.map(item => ({
        name: item.business,
        count: item._count.business,
      })),
      problemCategories: problemStats.map(item => ({
        name: item.category,
        count: item._count.category,
      })),
      recentAnalysis,
      monthlyTrend: Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
      })),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取统计数据失败',
      },
      { status: 500 }
    )
  }
}