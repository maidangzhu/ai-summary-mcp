#!/usr/bin/env node

// 数据库连接测试脚本
import { PrismaClient } from './src/generated/prisma/index.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const testDatabaseConnection = async () => {
  console.log('🔍 开始数据库连接测试...');
  console.log('📋 环境变量检查:');
  console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ 已设置' : '❌ 未设置');
  console.log('  DIRECT_URL:', process.env.DIRECT_URL ? '✅ 已设置' : '❌ 未设置');
  
  if (process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL);
    console.log('  数据库主机:', dbUrl.hostname);
    console.log('  数据库端口:', dbUrl.port);
    console.log('  数据库名称:', dbUrl.pathname.slice(1));
    console.log('  连接池模式:', dbUrl.searchParams.get('pgbouncer') ? '✅ 启用' : '❌ 禁用');
  }
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    console.log('\n🔗 测试数据库连接...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    console.log('\n🧪 测试基本查询...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ 基本查询成功:', result);
    
    console.log('\n📊 检查数据库表结构...');
    try {
      const tableCheck = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('analysis_results', 'problem_classifications')
      `;
      console.log('📋 数据库表:', tableCheck);
      
      if (Array.isArray(tableCheck) && tableCheck.length > 0) {
        console.log('✅ 数据库表结构正常');
        
        // 测试插入一条测试记录
        console.log('\n🧪 测试数据插入...');
        const testRecord = await prisma.analysisResult.create({
          data: {
            chatContent: '测试内容',
            filename: 'test-connection',
            primaryStack: 'test',
            markdownReport: '# 测试报告\n这是一个连接测试记录',
            focusAreas: ['test']
          }
        });
        console.log('✅ 测试记录创建成功，ID:', testRecord.id);
        
        // 删除测试记录
        await prisma.analysisResult.delete({
          where: { id: testRecord.id }
        });
        console.log('✅ 测试记录清理完成');
        
      } else {
        console.log('⚠️  数据库表不存在，需要运行迁移');
        console.log('💡 请运行: pnpm prisma migrate dev');
      }
    } catch (tableError) {
      console.error('❌ 检查数据库表时出错:', tableError.message);
      console.log('💡 可能需要运行数据库迁移: pnpm prisma migrate dev');
    }
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    console.error('🔍 错误详情:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    // 提供解决建议
    console.log('\n💡 可能的解决方案:');
    if (error.code === 'P1001') {
      console.log('  - 检查数据库服务器是否运行');
      console.log('  - 验证数据库连接字符串是否正确');
      console.log('  - 检查网络连接');
    } else if (error.code === 'P1000') {
      console.log('  - 检查数据库认证信息');
      console.log('  - 验证用户名和密码是否正确');
    } else if (error.code === 'P1003') {
      console.log('  - 检查数据库是否存在');
      console.log('  - 验证数据库名称是否正确');
    } else {
      console.log('  - 检查 .env 文件中的数据库配置');
      console.log('  - 运行 pnpm prisma generate 重新生成客户端');
      console.log('  - 运行 pnpm prisma migrate dev 执行数据库迁移');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 数据库连接已关闭');
  }
};

// 运行测试
testDatabaseConnection().catch(console.error);