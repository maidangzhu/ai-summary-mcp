import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));

// 保留这些作为外部依赖，不进行 bundle
const external = [
  '@modelcontextprotocol/sdk',
  'dotenv',
  'pg',
  'zod'
];

try {
  const outfile = join(projectRoot, 'build/index.js');
  
  await build({
    entryPoints: [join(projectRoot, 'src/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile,
    external,
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    // 启用 source map 以便调试
    sourcemap: false,
    // 压缩代码
    minify: false,
    // 保持函数名称以便调试
    keepNames: true
  });

  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}