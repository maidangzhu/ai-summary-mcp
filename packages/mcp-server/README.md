# AI协作档案分析器 - MCP服务器

[![npm version](https://badge.fury.io/js/%40ai-collaboration-archive%2Fmcp-server.svg)](https://badge.fury.io/js/%40ai-collaboration-archive%2Fmcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个基于 Model Context Protocol (MCP) 的 AI 协作档案分析服务器，专门用于分析 Bug 修复相关的聊天内容，生成包含技术栈、业务分析、标签分类、AI 思考、问题分类和总结的综合分析报告。

## 🚀 功能特性

- **🔍 综合分析**: 自动分析 Bug 修复聊天内容，提取关键信息
- **🏗️ 技术栈识别**: 智能识别项目使用的技术栈和框架
- **💼 业务分析**: 分析业务领域和相关功能模块
- **🏷️ 智能标签**: 自动生成相关标签和分类
- **🤖 AI 思考**: 提供 AI 的深度思考和建议
- **📊 问题分类**: 对问题进行结构化分类和总结
- **📄 技术文档**: 生成和管理技术文档
- **🗄️ 数据持久化**: 支持将分析结果保存到数据库
- **⚙️ 多 AI 提供商**: 支持 OpenAI、Claude、DeepSeek 等多种 AI 服务
- **🔧 模块化配置**: 灵活的分析模块开关配置

## 📦 安装

```bash
npm install @ai-collaboration-archive/mcp-server
# 或者
pnpm add @ai-collaboration-archive/mcp-server
# 或者
yarn add @ai-collaboration-archive/mcp-server
```

## 🛠️ 使用方法

### 作为 MCP 服务器使用

1. **安装并启动服务器**:

```bash
npx @ai-collaboration-archive/mcp-server
# 或者全局安装
npm install -g @ai-collaboration-archive/mcp-server
daily-thoughts
```

2. **配置 MCP 客户端**:

在你的 MCP 客户端配置中添加此服务器：

```json
{
  "mcpServers": {
    "daily-thoughts-analyzer": {
      "command": "npx",
      "args": ["@ai-collaboration-archive/mcp-server"]
    }
  }
}
```

### 作为 Node.js 模块使用

```typescript
import { ComprehensiveAnalyzer } from '@ai-collaboration-archive/mcp-server';
import { getAIService } from '@ai-collaboration-archive/mcp-server';

// 初始化 AI 服务
const aiService = await getAIService();
await aiService.initialize();

// 创建分析器
const analyzer = new ComprehensiveAnalyzer(aiService, {
  enableTechStack: true,
  enableBusiness: true,
  enableTags: true,
  enableAIThoughts: true,
  enableProblems: true,
  enableSummary: true
});

// 执行分析
const result = await analyzer.analyze(chatContent);
console.log('分析结果:', result);
```

## ⚙️ 配置

### 环境变量

创建 `.env` 文件或设置环境变量：

```env
# AI 服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# 数据库配置 (可选)
DATABASE_URL=postgresql://username:password@localhost:5432/database

# 其他配置
AI_PROVIDER=openai  # openai, anthropic, deepseek
AI_MODEL=gpt-4      # 具体模型名称
```

### 配置文件

在项目根目录创建 `mcp-config.json`：

```json
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "your_api_key",
    "baseURL": "https://api.openai.com/v1",
    "maxTokens": 4000,
    "temperature": 0.7
  },
  "analysis": {
    "enableTechStack": true,
    "enableBusiness": true,
    "enableTags": true,
    "enableAIThoughts": true,
    "enableProblems": true,
    "enableSummary": true
  },
  "database": {
    "enabled": true,
    "url": "postgresql://localhost:5432/analysis_db"
  }
}
```

## 🔧 API 文档

### MCP 工具

#### `bug_summary`

分析 Bug 修复相关的聊天内容，生成综合分析报告。

**参数**:

- `chatContent` (string, 必需): 需要分析的聊天内容
- `title` (string, 可选): 分析报告的标题
- `docTitle` (string, 可选): 技术文档的标题
- `docContent` (string, 可选): 技术文档的 Markdown 内容
- `analysisConfig` (object, 可选): 分析配置选项
  - `enableTechStack` (boolean): 是否启用技术栈分析
  - `enableBusiness` (boolean): 是否启用业务分析
  - `enableTags` (boolean): 是否启用标签生成
  - `enableAIThoughts` (boolean): 是否启用 AI 思考
  - `enableProblems` (boolean): 是否启用问题分类
  - `enableSummary` (boolean): 是否启用总结生成

**返回值**:

```typescript
interface AnalysisResult {
  techStack?: {
    primaryStack: string;
    frameworks: string[];
    languages: string[];
    tools: string[];
  };
  business?: {
    business: string;
    features: string[];
    domain: string;
  };
  tags?: string[];
  aiThoughts?: {
    insights: string[];
    recommendations: string[];
    concerns: string[];
  };
  problems?: Array<{
    type: string;
    description: string;
    solution: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  summary?: {
    overview: string;
    keyPoints: string[];
    conclusion: string;
  };
}
```

### Node.js API

#### `ComprehensiveAnalyzer`

主要的分析器类。

```typescript
class ComprehensiveAnalyzer {
  constructor(aiService: AIService, config: AnalysisConfig);
  
  async analyze(content: string): Promise<AnalysisResult>;
}
```

#### `getAIService()`

获取配置好的 AI 服务实例。

```typescript
function getAIService(): Promise<AIService>;
```

#### `saveAnalysisResult()`

保存分析结果到数据库。

```typescript
function saveAnalysisResult(
  result: AnalysisResult,
  chatContent: string,
  title?: string,
  docTitle?: string,
  docContent?: string
): Promise<string>;
```

## 📝 使用示例

### 基本使用

```typescript
import { ComprehensiveAnalyzer, getAIService } from '@ai-collaboration-archive/mcp-server';

const chatContent = `
用户: 我的 React 应用在生产环境下出现了内存泄漏问题
开发者: 这可能是由于组件卸载时没有清理事件监听器导致的
用户: 具体应该怎么修复？
开发者: 你需要在 useEffect 的清理函数中移除事件监听器...
`;

// 初始化服务
const aiService = await getAIService();
await aiService.initialize();

// 创建分析器
const analyzer = new ComprehensiveAnalyzer(aiService, {
  enableTechStack: true,
  enableBusiness: true,
  enableTags: true,
  enableAIThoughts: true,
  enableProblems: true,
  enableSummary: true
});

// 执行分析
const result = await analyzer.analyze(chatContent);

console.log('技术栈:', result.techStack?.primaryStack);
console.log('问题数量:', result.problems?.length);
console.log('标签:', result.tags);
```

### 自定义配置

```typescript
// 只启用特定分析模块
const analyzer = new ComprehensiveAnalyzer(aiService, {
  enableTechStack: true,
  enableProblems: true,
  enableSummary: true,
  enableBusiness: false,
  enableTags: false,
  enableAIThoughts: false
});

const result = await analyzer.analyze(chatContent);
```

### 与数据库集成

```typescript
import { saveAnalysisResult } from '@ai-collaboration-archive/mcp-server';

// 执行分析
const result = await analyzer.analyze(chatContent);

// 保存到数据库
const dbId = await saveAnalysisResult(
  result,
  chatContent,
  'Bug修复分析报告',
  '内存泄漏修复文档',
  '# 内存泄漏修复\n\n详细的修复步骤...'
);

console.log('保存成功，ID:', dbId);
```

## 🔧 开发

### 构建

```bash
pnpm install
pnpm run build
```

### 开发模式

```bash
pnpm run dev
```

### 测试

```bash
pnpm run test
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/) - 提供了优秀的协议标准
- [OpenAI](https://openai.com/) - 提供强大的 AI 能力
- [Anthropic](https://anthropic.com/) - Claude AI 服务
- [DeepSeek](https://deepseek.com/) - 国产优秀 AI 服务

## 📞 支持

如果你在使用过程中遇到问题，可以：

- 查看 [文档](https://github.com/your-username/mcp-server#readme)
- 提交 [Issue](https://github.com/your-username/mcp-server/issues)
- 发送邮件到 support@example.com

---

**注意**: 使用本工具需要配置相应的 AI 服务 API 密钥。请确保妥善保管你的 API 密钥，不要将其提交到版本控制系统中。