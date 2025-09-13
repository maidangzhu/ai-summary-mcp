# NPM 包发布指南

本文档介绍如何将 `@ai-collaboration-archive/mcp-server` 包发布到 npm 上。

## 📋 发布前准备

### 1. 环境要求

- Node.js >= 18.0.0
- pnpm (推荐) 或 npm
- npm 账户并已登录

### 2. 检查 npm 登录状态

```bash
npm whoami
```

如果未登录，请先登录：

```bash
npm login
```

## 🚀 发布流程

### 步骤 1: 构建项目

```bash
cd packages/mcp-server
pnpm run build
```

### 步骤 2: 运行发布前检查

```bash
pnpm run test:publish
```

这个命令会检查：
- ✅ 必需文件是否存在
- ✅ package.json 配置是否完整
- ✅ 构建输出是否正确
- ✅ 依赖关系是否合理

### 步骤 3: 预览发布内容

```bash
npm pack --dry-run
```

这会显示将要发布的文件列表，确保没有包含不必要的文件。

### 步骤 4: 发布到 npm

#### 发布正式版本

```bash
npm publish
```

#### 发布测试版本

```bash
npm publish --tag beta
```

## 📦 包配置说明

### package.json 关键配置

```json
{
  "name": "@ai-collaboration-archive/mcp-server",
  "version": "3.0.0",
  "main": "build/index.js",
  "types": "build/index.d.ts",
  "bin": {
    "daily-thoughts": "./build/index.js"
  },
  "files": [
    "build",
    "README.md",
    "LICENSE",
    "mcp-config.json"
  ],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### 发布脚本说明

- `prepublishOnly`: 发布前自动运行，包含清理、构建和检查
- `test:publish`: 运行发布前检查脚本
- `prepack`: 打包前运行构建

## 🔍 发布检查清单

在发布前，请确保以下项目都已完成：

### 必需文件
- [ ] `README.md` - 详细的使用文档
- [ ] `LICENSE` - 开源许可证
- [ ] `package.json` - 完整的包配置
- [ ] `build/index.js` - 编译后的主文件
- [ ] `build/index.d.ts` - TypeScript 类型声明

### package.json 配置
- [ ] `name` - 包名称
- [ ] `version` - 版本号（遵循语义化版本）
- [ ] `description` - 包描述
- [ ] `main` - 主入口文件
- [ ] `types` - TypeScript 类型文件
- [ ] `bin` - 命令行工具配置
- [ ] `files` - 发布文件列表
- [ ] `keywords` - 搜索关键词
- [ ] `author` - 作者信息
- [ ] `license` - 许可证
- [ ] `repository` - 仓库地址
- [ ] `homepage` - 项目主页
- [ ] `bugs` - 问题反馈地址
- [ ] `engines` - Node.js 版本要求
- [ ] `publishConfig` - 发布配置

### 构建输出
- [ ] 构建成功无错误
- [ ] 生成了类型声明文件
- [ ] 主入口文件包含正确的 shebang
- [ ] 所有依赖正确解析

## 🔄 版本管理

### 语义化版本控制

遵循 [Semantic Versioning](https://semver.org/) 规范：

- **MAJOR** (主版本号): 不兼容的 API 修改
- **MINOR** (次版本号): 向下兼容的功能性新增
- **PATCH** (修订号): 向下兼容的问题修正

### 版本更新命令

```bash
# 修订版本 (3.0.0 -> 3.0.1)
npm version patch

# 次版本 (3.0.0 -> 3.1.0)
npm version minor

# 主版本 (3.0.0 -> 4.0.0)
npm version major

# 预发布版本 (3.0.0 -> 3.0.1-beta.0)
npm version prerelease --preid=beta
```

## 🚨 常见问题

### 1. 发布失败：权限错误

```
npm ERR! 403 Forbidden
```

**解决方案**:
- 确保已登录 npm: `npm whoami`
- 检查包名是否已被占用
- 确认有发布权限（对于 scoped 包）

### 2. 构建失败

**解决方案**:
- 检查 TypeScript 配置
- 确保所有依赖已安装
- 运行 `pnpm run clean && pnpm run build`

### 3. 工作区依赖问题

对于 `workspace:*` 依赖，发布时需要确保：
- 依赖包已发布到 npm
- 或者使用相对路径引用

### 4. 类型声明文件缺失

确保 `tsconfig.json` 中设置了：
```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

## 📈 发布后操作

### 1. 验证发布

```bash
# 检查包是否可以安装
npm install @ai-collaboration-archive/mcp-server

# 测试命令行工具
npx @ai-collaboration-archive/mcp-server --help
```

### 2. 更新文档

- 更新 README.md 中的版本信息
- 添加 CHANGELOG.md 记录变更
- 更新相关文档链接

### 3. 创建 Git 标签

```bash
git tag v3.0.0
git push origin v3.0.0
```

## 🔧 自动化发布

可以考虑使用 GitHub Actions 自动化发布流程：

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test:publish
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📚 相关资源

- [npm 官方文档](https://docs.npmjs.com/)
- [语义化版本控制](https://semver.org/)
- [TypeScript 声明文件](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

**注意**: 发布到 npm 是不可逆的操作，请在发布前仔细检查所有配置和内容。建议先发布到测试环境或使用 `--dry-run` 参数预览。