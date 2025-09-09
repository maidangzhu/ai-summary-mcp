# AI协作档案分析器 (AI Collaboration Archive)

一个基于pnpm monorepo架构的AI协作档案分析和展示系统，包含MCP服务器和NextJS前端应用。

## 🏗️ 项目架构

```
ai-collaboration-archive/
├── packages/
│   ├── mcp-server/          # MCP服务器 - AI协作数据分析
│   └── web/                 # NextJS前端 - 个人展示页面
├── prisma/                  # 共享数据库配置
├── .env.example            # 环境变量示例
├── pnpm-workspace.yaml     # pnpm workspace配置
└── package.json            # 根目录配置
```

## 🚀 快速开始

### 环境要求

- Node.js 20+
- pnpm 8+
- PostgreSQL 数据库

### 安装依赖

```bash
# 安装所有包的依赖
pnpm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 配置数据库连接和API密钥：
```env
# 数据库
DIRECT_URL="postgresql://username:password@localhost:5432/ai_collaboration_archive"
DATABASE_URL="postgresql://username:password@localhost:5432/ai_collaboration_archive"

# AI服务
OPENAI_API_KEY="your_openai_api_key_here"
ANTHROPIC_API_KEY="your_anthropic_api_key_here"
DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

### 数据库设置

```bash
# 生成Prisma客户端
pnpm db:generate

# 推送数据库模式
pnpm db:push

# 或运行迁移
pnpm db:migrate
```

### 启动开发服务

```bash
# 启动所有服务
pnpm dev

# 或分别启动
pnpm --filter mcp-server dev    # MCP服务器
pnpm --filter web dev           # NextJS前端
```

## 📦 包说明

### MCP Server (`packages/mcp-server`)

AI协作档案分析器的核心服务，提供：

- **六维度分析系统**：技术栈、业务、标签、AI思考、问题分类、解决方案
- **多AI提供商支持**：DeepSeek、OpenAI、Claude、自定义API
- **MCP协议集成**：与AI工具无缝对接
- **智能数据存储**：自动分析和结构化存储

#### 主要功能

- `analyze-chat`: 分析AI对话内容
- `get-analysis-results`: 获取分析结果
- `get-stats`: 获取统计信息
- `search-analysis`: 搜索分析记录
- `export-data`: 导出数据

#### 启动服务

```bash
cd packages/mcp-server
pnpm dev
```

### Web Frontend (`packages/web`)

NextJS前端应用，提供个人展示页面：

- **响应式设计**：支持移动端和桌面端
- **深色主题**：简约线条感设计风格
- **Markdown渲染**：支持代码高亮和语法解析
- **实时数据**：与MCP服务器数据同步

#### 主要特性

- 个人资料展示卡片
- AI协作分析记录列表
- 技术栈和业务领域筛选
- Markdown内容渲染
- 深色主题UI设计

#### 启动开发服务

```bash
cd packages/web
pnpm dev
```

访问 http://localhost:3000 查看前端页面。

## 🛠️ 开发命令

### 根目录命令

```bash
# 构建所有包
pnpm build

# 启动所有服务
pnpm dev

# 清理构建文件
pnpm clean

# 数据库操作
pnpm db:generate    # 生成Prisma客户端
pnpm db:push        # 推送数据库模式
pnpm db:migrate     # 运行迁移
pnpm db:studio      # 打开Prisma Studio
```

### 包级别命令

```bash
# 在特定包中运行命令
pnpm --filter mcp-server <command>
pnpm --filter web <command>

# 示例
pnpm --filter web build
pnpm --filter mcp-server start
```

## 🎨 设计特色

### 深色主题

- 基于Tailwind CSS的深色配色方案
- 自定义CSS变量支持主题切换
- 优化的对比度和可读性

### 线条感设计

- 渐变边框效果
- 脉冲动画和发光效果
- 玻璃态背景
- 交互式悬停效果

### 响应式布局

- 移动端优先设计
- 灵活的网格系统
- 自适应组件布局

## 📊 数据模型

### AnalysisResult (分析结果)

```typescript
interface AnalysisResult {
  id: string
  title?: string
  chatContent: string      // Markdown格式的对话内容
  primaryStack?: string    // 主要技术栈
  business?: string        // 业务领域
  tags: string[]          // 标签列表
  keyQuestions: string[]  // AI思考要点
  summary?: string        // 总结
  problems: ProblemClassification[]
  createdAt: Date
  updatedAt: Date
}
```

### ProblemClassification (问题分类)

```typescript
interface ProblemClassification {
  id: string
  category: string        // 问题类别
  subCategory?: string    // 子类别
  severity: string        // 严重程度
  complexity: string      // 复杂度
  estimatedTime: string   // 预估时间
  tags: string[]         // 相关标签
  reasoning: string      // 分类理由
}
```

## 🔧 配置说明

### MCP服务器配置

位置：`packages/mcp-server/mcp-config.json`

```json
{
  "aiProvider": "deepseek",
  "enabledAnalyzers": {
    "techStack": true,
    "business": true,
    "tags": true,
    "aiThinking": true,
    "problemClassification": true,
    "solutionExtraction": true
  },
  "prompts": {
    "techStackAnalysis": "自定义技术栈分析提示词",
    "businessAnalysis": "自定义业务分析提示词"
  }
}
```

### NextJS配置

位置：`packages/web/next.config.js`

- 支持App Router
- 图片域名配置
- 实验性功能启用

## 🚀 部署

### 生产构建

```bash
# 构建所有包
pnpm build

# 启动生产服务
pnpm start
```

### Docker部署

```dockerfile
# 示例Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [MCP (Model Context Protocol)](https://github.com/modelcontextprotocol) - AI工具通信协议
- [Next.js](https://nextjs.org/) - React框架
- [Prisma](https://prisma.io/) - 数据库ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Radix UI](https://radix-ui.com/) - 无障碍UI组件

---

**AI协作档案分析器** - 让AI协作过程变得有价值、可记录、可展示 🚀