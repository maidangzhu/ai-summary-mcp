#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');

/**
 * 发布前检查脚本
 * 验证包的完整性和发布准备情况
 */
class PublishChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 检查必需文件是否存在
   */
  checkRequiredFiles() {
    console.log('🔍 检查必需文件...');
    
    const requiredFiles = [
      'package.json',
      'README.md',
      'build/index.js',
      'build/index.d.ts'
    ];

    for (const file of requiredFiles) {
      const filePath = join(packageRoot, file);
      if (!existsSync(filePath)) {
        this.errors.push(`缺少必需文件: ${file}`);
      } else {
        console.log(`  ✅ ${file}`);
      }
    }
  }

  /**
   * 检查 package.json 配置
   */
  checkPackageJson() {
    console.log('\n📦 检查 package.json 配置...');
    
    try {
      const packagePath = join(packageRoot, 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

      // 检查必需字段
      const requiredFields = [
        'name',
        'version',
        'description',
        'main',
        'types',
        'author',
        'license',
        'repository',
        'homepage',
        'bugs'
      ];

      for (const field of requiredFields) {
        if (!packageJson[field]) {
          this.errors.push(`package.json 缺少字段: ${field}`);
        } else {
          console.log(`  ✅ ${field}: ${typeof packageJson[field] === 'object' ? JSON.stringify(packageJson[field]) : packageJson[field]}`);
        }
      }

      // 检查版本格式
      const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
      if (!versionRegex.test(packageJson.version)) {
        this.errors.push(`版本号格式不正确: ${packageJson.version}`);
      }

      // 检查 files 字段
      if (!packageJson.files || !Array.isArray(packageJson.files)) {
        this.warnings.push('建议设置 files 字段以控制发布内容');
      } else {
        console.log(`  ✅ files: ${packageJson.files.join(', ')}`);
      }

      // 检查 engines
      if (!packageJson.engines || !packageJson.engines.node) {
        this.warnings.push('建议设置 engines.node 字段指定 Node.js 版本要求');
      } else {
        console.log(`  ✅ engines.node: ${packageJson.engines.node}`);
      }

      // 检查 publishConfig
      if (!packageJson.publishConfig) {
        this.warnings.push('建议设置 publishConfig 字段');
      } else {
        console.log(`  ✅ publishConfig: ${JSON.stringify(packageJson.publishConfig)}`);
      }

    } catch (error) {
      this.errors.push(`读取 package.json 失败: ${error.message}`);
    }
  }

  /**
   * 检查构建输出
   */
  checkBuildOutput() {
    console.log('\n🏗️  检查构建输出...');
    
    const buildDir = join(packageRoot, 'build');
    if (!existsSync(buildDir)) {
      this.errors.push('build 目录不存在，请先运行 pnpm run build');
      return;
    }

    // 检查主入口文件
    const mainFile = join(buildDir, 'index.js');
    if (!existsSync(mainFile)) {
      this.errors.push('主入口文件 build/index.js 不存在');
    } else {
      console.log('  ✅ build/index.js');
      
      // 检查文件是否可执行（对于 bin 文件）
      try {
        const content = readFileSync(mainFile, 'utf8');
        if (!content.startsWith('#!/usr/bin/env node')) {
          this.warnings.push('主入口文件缺少 shebang，可能影响 bin 命令执行');
        }
      } catch (error) {
        this.errors.push(`读取主入口文件失败: ${error.message}`);
      }
    }

    // 检查类型声明文件
    const typesFile = join(buildDir, 'index.d.ts');
    if (!existsSync(typesFile)) {
      this.errors.push('类型声明文件 build/index.d.ts 不存在');
    } else {
      console.log('  ✅ build/index.d.ts');
    }
  }

  /**
   * 检查依赖
   */
  checkDependencies() {
    console.log('\n📚 检查依赖...');
    
    try {
      const packagePath = join(packageRoot, 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

      // 检查是否有 peerDependencies 冲突
      if (packageJson.peerDependencies && packageJson.dependencies) {
        for (const dep of Object.keys(packageJson.peerDependencies)) {
          if (packageJson.dependencies[dep]) {
            this.warnings.push(`依赖 ${dep} 同时存在于 dependencies 和 peerDependencies 中`);
          }
        }
      }

      // 检查工作区依赖
      if (packageJson.dependencies) {
        for (const [name, version] of Object.entries(packageJson.dependencies)) {
          if (typeof version === 'string' && version.startsWith('workspace:')) {
            console.log(`  ⚠️  工作区依赖: ${name}@${version}`);
            this.warnings.push(`工作区依赖 ${name} 在发布时需要确保正确解析`);
          }
        }
      }

      console.log('  ✅ 依赖检查完成');
    } catch (error) {
      this.errors.push(`检查依赖失败: ${error.message}`);
    }
  }

  /**
   * 运行所有检查
   */
  async runAllChecks() {
    console.log('🚀 开始发布前检查...\n');
    
    this.checkRequiredFiles();
    this.checkPackageJson();
    this.checkBuildOutput();
    this.checkDependencies();

    // 输出结果
    console.log('\n📊 检查结果:');
    
    if (this.errors.length > 0) {
      console.log('\n❌ 发现错误:');
      for (const error of this.errors) {
        console.log(`  • ${error}`);
      }
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  警告:');
      for (const warning of this.warnings) {
        console.log(`  • ${warning}`);
      }
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ 所有检查通过！包已准备好发布。');
      return true;
    } else if (this.errors.length === 0) {
      console.log('\n✅ 基本检查通过，但有一些警告需要注意。');
      return true;
    } else {
      console.log('\n❌ 检查失败，请修复错误后重试。');
      return false;
    }
  }
}

// 运行检查
const checker = new PublishChecker();
checker.runAllChecks().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('检查过程中发生错误:', error);
  process.exit(1);
});