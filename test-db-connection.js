#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 用于测试 Supabase 数据库的连接情况
 */

import { Client } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// 颜色输出函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

// 测试单个连接
async function testConnection(connectionString, connectionName) {
  console.log(colors.blue(`\n=== 测试 ${connectionName} ===`));
  console.log(colors.cyan(`连接字符串: ${connectionString.replace(/:[^:@]*@/, ':****@')}`));
  
  const client = new Client({
    connectionString: connectionString,
    connectionTimeoutMillis: 10000, // 10秒超时
    query_timeout: 5000, // 5秒查询超时
  });

  try {
    console.log(colors.yellow('正在连接...'));
    await client.connect();
    console.log(colors.green('✅ 连接成功!'));

    // 测试基本查询
    console.log(colors.yellow('正在测试基本查询...'));
    const versionResult = await client.query('SELECT version()');
    console.log(colors.green(`✅ 数据库版本: ${versionResult.rows[0].version.split(' ')[0]} ${versionResult.rows[0].version.split(' ')[1]}`));

    // 测试当前时间
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log(colors.green(`✅ 当前时间: ${timeResult.rows[0].current_time}`));

    // 测试数据库名称
    const dbResult = await client.query('SELECT current_database()');
    console.log(colors.green(`✅ 数据库名称: ${dbResult.rows[0].current_database}`));

    // 测试用户权限
    const userResult = await client.query('SELECT current_user, session_user');
    console.log(colors.green(`✅ 当前用户: ${userResult.rows[0].current_user}`));

    return true;
  } catch (error) {
    console.log(colors.red('❌ 连接失败!'));
    console.log(colors.red(`错误代码: ${error.code || 'N/A'}`));
    console.log(colors.red(`错误消息: ${error.message}`));
    
    // 详细错误分析
    if (error.code === 'ENOTFOUND') {
      console.log(colors.yellow('💡 DNS 解析失败，请检查主机名是否正确'));
    } else if (error.code === 'ECONNREFUSED') {
      console.log(colors.yellow('💡 连接被拒绝，请检查端口号和防火墙设置'));
    } else if (error.code === 'ETIMEDOUT') {
      console.log(colors.yellow('💡 连接超时，请检查网络连接'));
    } else if (error.code === '28P01') {
      console.log(colors.yellow('💡 身份验证失败，请检查用户名和密码'));
    } else if (error.code === '3D000') {
      console.log(colors.yellow('💡 数据库不存在，请检查数据库名称'));
    }
    
    return false;
  } finally {
    try {
      await client.end();
    } catch (endError) {
      console.log(colors.yellow(`警告: 关闭连接时出错: ${endError.message}`));
    }
  }
}

// 解析连接字符串信息
function parseConnectionString(connectionString) {
  try {
    const url = new URL(connectionString);
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      database: url.pathname.slice(1),
      username: url.username,
      password: url.password ? '****' : 'N/A',
      searchParams: Object.fromEntries(url.searchParams)
    };
  } catch (error) {
    return { error: error.message };
  }
}

// 主函数
async function main() {
  console.log(colors.bold(colors.cyan('🔍 Supabase 数据库连接测试工具')));
  console.log(colors.cyan('=====================================\n'));

  // 检查环境变量
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!databaseUrl && !directUrl) {
    console.log(colors.red('❌ 未找到数据库连接字符串!'));
    console.log(colors.yellow('请确保 .env 文件中包含 DATABASE_URL 或 DIRECT_URL'));
    process.exit(1);
  }

  // 显示连接信息
  console.log(colors.bold('📋 连接配置信息:'));
  
  if (databaseUrl) {
    console.log(colors.cyan('\nDATABASE_URL (连接池):'));
    const poolInfo = parseConnectionString(databaseUrl);
    console.log(JSON.stringify(poolInfo, null, 2));
  }

  if (directUrl) {
    console.log(colors.cyan('\nDIRECT_URL (直接连接):'));
    const directInfo = parseConnectionString(directUrl);
    console.log(JSON.stringify(directInfo, null, 2));
  }

  let poolSuccess = false;
  let directSuccess = false;

  // 测试连接池连接
  if (databaseUrl) {
    poolSuccess = await testConnection(databaseUrl, '连接池连接 (DATABASE_URL)');
  }

  // 测试直接连接
  if (directUrl) {
    directSuccess = await testConnection(directUrl, '直接连接 (DIRECT_URL)');
  }

  // 总结
  console.log(colors.bold(colors.cyan('\n📊 测试结果总结:')));
  console.log(colors.cyan('==================='));
  
  if (databaseUrl) {
    console.log(`连接池连接: ${poolSuccess ? colors.green('✅ 成功') : colors.red('❌ 失败')}`);
  }
  
  if (directUrl) {
    console.log(`直接连接: ${directSuccess ? colors.green('✅ 成功') : colors.red('❌ 失败')}`);
  }

  // 建议
  console.log(colors.bold(colors.cyan('\n💡 建议:')));
  if (poolSuccess && directSuccess) {
    console.log(colors.green('🎉 所有连接都正常工作！'));
    console.log(colors.green('现在可以运行 Prisma migrate 命令了'));
  } else if (!poolSuccess && directSuccess) {
    console.log(colors.yellow('⚠️  连接池连接失败，但直接连接成功'));
    console.log(colors.yellow('Prisma migrate 应该可以工作，但应用程序可能无法正常连接'));
  } else if (poolSuccess && !directSuccess) {
    console.log(colors.yellow('⚠️  直接连接失败，但连接池连接成功'));
    console.log(colors.yellow('应用程序可以工作，但 Prisma migrate 可能会失败'));
  } else {
    console.log(colors.red('🚨 所有连接都失败了'));
    console.log(colors.red('请检查网络连接、凭据和 Supabase 项目状态'));
  }

  console.log(colors.cyan('\n如果问题持续存在，请检查:'));
  console.log('1. Supabase 项目是否处于活动状态');
  console.log('2. 数据库密码是否正确');
  console.log('3. IP 地址是否在 Supabase 允许列表中');
  console.log('4. 网络连接是否正常');
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(colors.red('💥 脚本执行出错:'), error);
    process.exit(1);
  });
}

export { testConnection, parseConnectionString };