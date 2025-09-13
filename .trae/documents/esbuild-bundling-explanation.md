# 为什么 esbuild 能解决 DB 打包问题？

## 问题的本质

在 monorepo 中，你遇到的问题本质上是 **编译器（Compiler）** 和 **打包器（Bundler）** 的职责差异导致的。

## 引入 esbuild 前的状态

### TypeScript 编译器的工作原理

```mermaid
flowchart TD
    A["📝 TypeScript 源码"] --> B["🔍 TypeScript 编译器 (tsc)"]
    B --> C["📄 JavaScript 文件"]
    B --> D["📋 类型定义文件 (.d.ts)"]
    
    E["📦 package.json dependencies"] -.-> F["⚠️ 外部依赖引用"]
    C --> F
    
    style A fill:#2d3748,stroke:#4a5568,color:#e2e8f0
    style B fill:#2a4365,stroke:#3182ce,color:#bee3f8
    style C fill:#2d3748,stroke:#4a5568,color:#e2e8f0
    style D fill:#2d3748,stroke:#4a5568,color:#e2e8f0
    style E fill:#742a2a,stroke:#c53030,color:#fed7d7
    style F fill:#742a2a,stroke:#c53030,color:#fed7d7
```

### 编译前后的代码对比

**编译前 (TypeScript):**
```typescript
// packages/mcp-server/src/index.ts
import { PrismaClient } from '@downzoo/db';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const prisma = new PrismaClient();
const server = new Server(/* ... */);
```

**编译后 (JavaScript):**
```javascript
// packages/mcp-server/build/index.js
import { PrismaClient } from '@downzoo/db';  // ❌ 仍然是外部依赖！
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const prisma = new PrismaClient();
const server = new Server(/* ... */);
```

### 发布到 npm 后的问题

```mermaid
flowchart LR
    A["👤 用户执行 npm install"] --> B["📦 下载 mcp-server"]
    B --> C["🔍 解析 dependencies"]
    C --> D["❌ 找不到 @downzoo/db"]
    
    E["📋 package.json"] --> F["dependencies: { '@downzoo/db': '^1.0.0' }"]
    F --> G["🌐 npm registry"]
    G -.-> H["❌ 404 Not Found"]
    
    style A fill:#2d3748,stroke:#4a5568,color:#e2e8f0
    style B fill:#2a4365,stroke:#3182ce,color:#bee3f8
    style C fill:#2a4365,stroke:#3182ce,color:#bee3f8
    style D fill:#742a2a,stroke:#c53030,color:#fed7d7
    style E fill:#2d3748,stroke:#4a5568,color:#e2e8f0
    style F fill:#2d3748,stroke:#4a5568,color:#e2e8f0
    style G fill:#2a4365,stroke:#3182ce,color:#bee3f8
    style H fill:#742a2a,stroke:#c53030,color:#fed7d7
```

## 引入 esbuild 后的状态

### esbuild 打包器的工作原理

```mermaid
flowchart TD
    A["📝 TypeScript 源码"] --> B["🎯 esbuild 打包器"]
    C["📦 @downzoo/db 源码"] --> B
    D["📦 @prisma/client"] --> B
    
    B