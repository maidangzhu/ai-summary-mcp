# MCP 服务器发布指南

本指南详细介绍了如何发布和分发 Model Context Protocol (MCP) 服务器的多种方式，帮助开发者选择最适合的发布策略。

## 目录

1. [NPM 包发布方式](#npm-包发布方式)
2. [GitHub 发布方式](#github-发布方式)
3. [Docker 容器发布](#docker-容器发布)
4. [本地安装方式](#本地安装方式)
5. [发布方式对比](#发布方式对比)
6. [最佳实践建议](#最佳实践建议)
7. [用户使用指南](#用户使用指南)

## NPM 包发布方式

### 1. 准备 package.json

```json
{
  "name": "@your-org/mcp-chat-analyzer",
  "version": "1.0.0",
  "description": "AI协作档案分析器 MCP 服务器",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "mcp-chat-analyzer": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts",
    "prepublishOnly": "npm run build",
    "test": "jest"
  },
  "keywords": [
    "mcp",
    "model-context-protocol",
    "ai",
    "chat-analysis",
    "llm"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/mcp-chat-analyzer.git"
  },
  "bugs": {
    "url": "https://github.com/your-org/mcp-chat-analyzer/issues"
  },
  "homepage": "https://github.com/your-org/mcp-chat-analyzer#readme",
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "package.json"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "jest": "^29.0.0"
  }
}
```

### 2. 构建配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 3. 添加 shebang 到入口文件

```typescript
#!/usr/bin/env node

// 你的 MCP 服务器代码
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
// ... 其他导入和代码
```

### 4. 发布流程

```bash
# 1. 登录 NPM
npm login

# 2. 构建项目
npm run build

# 3. 测试本地安装
npm pack
npm install -g ./your-package-1.0.0.tgz

# 4. 发布到 NPM
npm publish

# 5. 发布 scoped 包（推荐）
npm publish --access public
```

### 5. 用户安装和使用

```bash
# 全局安装
npm install -g @your-org/mcp-chat-analyzer

# 或使用 npx 直接运行
npx @your-org/mcp-chat-analyzer
```

## GitHub 发布方式

### 1. 创建 GitHub Release

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

### 2. 用户安装方式

```bash
# 克隆仓库
git clone https://github.com/your-org/mcp-chat-analyzer.git
cd mcp-chat-analyzer

# 安装依赖
npm install

# 构建
npm run build

# 运行
npm start
```

## Docker 容器发布

### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production

# 生成 Prisma 客户端
RUN npx prisma generate

# 复制源代码
COPY dist ./dist/

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001

# 切换到非 root 用户
USER mcp

# 暴露端口（如果需要）
EXPOSE 3000

# 启动命令
CMD ["node", "dist/index.js"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mcp-server:
    build: .
    container_name: mcp-chat-analyzer
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./dev.db
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    
  # 可选：添加数据库服务
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mcp_analyzer
      POSTGRES_USER: mcp
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. 发布到 Docker Hub

```bash
# 构建镜像
docker build -t your-org/mcp-chat-analyzer:latest .

# 推送到 Docker Hub
docker push your-org/mcp-chat-analyzer:latest

# 用户使用
docker run -d --name mcp-server your-org/mcp-chat-analyzer:latest
```

## 本地安装方式

### 1. 创建安装脚本

```bash
#!/bin/bash
# install.sh

set -e

echo "🚀 安装 MCP Chat Analyzer..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 需要安装 Node.js (>= 18.0.0)"
    exit 1
fi

# 检查版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js 版本过低，需要 >= $REQUIRED_VERSION"
    exit 1
fi

# 创建安装目录
INSTALL_DIR="$HOME/.mcp-chat-analyzer"
mkdir -p "$INSTALL_DIR"

# 下载最新版本
echo "📥 下载最新版本..."
LATEST_URL="https://github.com/your-org/mcp-chat-analyzer/archive/refs/heads/main.zip"
curl -L "$LATEST_URL" -o "$INSTALL_DIR/mcp-chat-analyzer.zip"

# 解压
echo "📦 解压文件..."
cd "$INSTALL_DIR"
unzip -q mcp-chat-analyzer.zip
mv mcp-chat-analyzer-main/* .
rm -rf mcp-chat-analyzer-main mcp-chat-analyzer.zip

# 安装依赖
echo "📚 安装依赖..."
npm install

# 构建
echo "🔨 构建项目..."
npm run build

# 创建符号链接
echo "🔗 创建命令链接..."
sudo ln -sf "$INSTALL_DIR/dist/index.js" "/usr/local/bin/mcp-chat-analyzer"
chmod +x "$INSTALL_DIR/dist/index.js"

echo "✅ 安装完成！"
echo "💡 使用方法: mcp-chat-analyzer"
```

### 2. 卸载脚本

```bash
#!/bin/bash
# uninstall.sh

echo "🗑️  卸载 MCP Chat Analyzer..."

# 删除符号链接
sudo rm -f /usr/local/bin/mcp-chat-analyzer

# 删除安装目录
rm -rf "$HOME/.mcp-chat-analyzer"

echo "✅ 卸载完成！"
```

## 发布方式对比

| 发布方式 | 优点 | 缺点 | 适用场景 |
|---------|------|------|----------|
| **NPM 包** | • 安装简单 (`npx`)<br>• 版本管理完善<br>• 自动依赖处理<br>• 广泛接受度 | • 需要 NPM 账号<br>• 包大小限制<br>• 依赖 Node.js 生态 | • 通用工具<br>• 开源项目<br>• 频繁更新 |
| **GitHub Release** | • 免费托管<br>• 版本控制集成<br>• 支持多平台<br>• 详细发布说明 | • 需要手动安装<br>• 依赖管理复杂<br>• 更新不便 | • 开源项目<br>• 企业内部<br>• 定制化需求 |
| **Docker 容器** | • 环境隔离<br>• 跨平台一致性<br>• 易于部署<br>• 包含所有依赖 | • 镜像体积大<br>• 需要 Docker 环境<br>• 学习成本 | • 生产环境<br>• 微服务架构<br>• 云原生应用 |
| **本地安装** | • 完全控制<br>• 无外部依赖<br>• 自定义安装路径 | • 安装复杂<br>• 维护困难<br>• 平台兼容性 | • 企业内部<br>• 特殊环境<br>• 离线安装 |

## 最佳实践建议

### 1. 版本管理

```json
// 使用语义化版本
{
  "version": "1.2.3",
  // 主版本.次版本.修订版本
  // 1: 不兼容的 API 修改
  // 2: 向下兼容的功能性新增
  // 3: 向下兼容的问题修正
}
```

### 2. 文档完善

```markdown
# README.md 必备内容
- 项目描述和功能
- 安装方法
- 使用示例
- API 文档
- 配置说明
- 故障排除
- 贡献指南
- 许可证信息
```

### 3. 测试覆盖

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 4. 安全考虑

```bash
# 定期更新依赖
npm audit
npm audit fix

# 使用 .npmignore
node_modules/
*.log
.env
src/
tsconfig.json
jest.config.js
```

### 5. CI/CD 流程

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## 用户使用指南

### NPM 包使用

```bash
# 全局安装
npm install -g @your-org/mcp-chat-analyzer

# 直接运行
npx @your-org/mcp-chat-analyzer

# 在 Claude Desktop 中配置
# ~/.config/claude-desktop/claude_desktop_config.json
{
  "mcpServers": {
    "chat-analyzer": {
      "command": "npx",
      "args": ["@your-org/mcp-chat-analyzer"]
    }
  }
}
```

### Docker 使用

```bash
# 拉取镜像
docker pull your-org/mcp-chat-analyzer

# 运行容器
docker run -d \
  --name mcp-server \
  -v $(pwd)/data:/app/data \
  your-org/mcp-chat-analyzer

# 在 Claude Desktop 中配置
{
  "mcpServers": {
    "chat-analyzer": {
      "command": "docker",
      "args": ["exec", "mcp-server", "node", "dist/index.js"]
    }
  }
}
```

### GitHub 源码使用

```bash
# 克隆并安装
git clone https://github.com/your-org/mcp-chat-analyzer.git
cd mcp-chat-analyzer
npm install
npm run build

# 在 Claude Desktop 中配置
{
  "mcpServers": {
    "chat-analyzer": {
      "command": "node",
      "args": ["/path/to/mcp-chat-analyzer/dist/index.js"]
    }
  }
}
```

## 总结

选择合适的发布方式取决于你的具体需求：

- **快速分发和易用性**：选择 NPM 包发布
- **开源协作和版本控制**：选择 GitHub Release
- **生产环境和容器化**：选择 Docker 发布
- **企业内部和定制化**：选择本地安装方式

建议采用多种发布方式并行，以满足不同用户的需求。同时，确保提供完善的文档和示例，帮助用户快速上手使用你的 MCP 服务器。