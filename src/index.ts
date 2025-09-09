#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// 技术栈枚举
enum TechStack {
	FRONTEND = "frontend",
	BACKEND = "backend",
	MOBILE = "mobile",
	DEVOPS = "devops",
	DATABASE = "database",
	AI_ML = "ai_ml",
	BLOCKCHAIN = "blockchain",
	GAME_DEV = "game_dev",
	EMBEDDED = "embedded",
	TESTING = "testing",
	DESIGN = "design",
	OTHER = "other",
}

// 问题分类枚举
enum ProblemCategory {
	BUG_FIX = "bug_fix",
	FEATURE_REQUEST = "feature_request",
	PERFORMANCE = "performance",
	SECURITY = "security",
	ARCHITECTURE = "architecture",
	CODE_REVIEW = "code_review",
	DEPLOYMENT = "deployment",
	LEARNING = "learning",
	TROUBLESHOOTING = "troubleshooting",
	OPTIMIZATION = "optimization",
	INTEGRATION = "integration",
	OTHER = "other",
}

// 类型定义
interface TechStackAnalysis {
	primaryStack: TechStack;
	secondaryStacks: TechStack[];
	technologies: string[];
	frameworks: string[];
	tools: string[];
	confidence: number;
	reasoning: string;
}

interface ProblemClassification {
	category: ProblemCategory;
	subCategory?: string;
	severity: "low" | "medium" | "high" | "critical";
	complexity: "simple" | "moderate" | "complex" | "expert";
	estimatedTime: string;
	tags: string[];
	reasoning: string;
}

interface ChatSummaryResult {
	focusAreas: string[];
	thoughts: string[];
	solvedProblems: string[];
	techStackAnalysis?: TechStackAnalysis;
	problemClassifications?: ProblemClassification[];
	markdown: string;
}

interface DeepSeekResponse {
	choices: {
		message: {
			content: string;
		};
	}[];
}

// 导入模块
import { ComprehensiveAnalysisResult } from "./types.js";
import {
	loadConfig,
	saveConfig,
	updateAIConfig,
	resetConfig,
	validateConfig,
} from "./config.js";
import { getAIService } from "./ai-service.js";
import { ComprehensiveAnalyzer } from "./analyzers.js";
import { getMarkdownGenerator } from "./markdown-generator.js";
import { 
	saveAnalysisResult, 
	closeDatabaseConnection,
	getAnalysisResult,
	getAllAnalysisResults,
	searchByTechStack,
	searchByBusinessDomain,
	deleteAnalysisResult
} from "./database.js";

// 创建MCP服务器
const server = new Server(
	{
		name: "ai-collaboration-archive-analyzer",
		version: "3.0.0",
	},
	{
		capabilities: {
			tools: {},
		},
	}
);

// 保存Markdown文件的函数
const saveMarkdownFile = async (
	content: string,
	filename?: string
): Promise<string> => {
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	const fileName = filename || `analysis-${timestamp}.md`;
	const documentsDir = path.join(process.cwd(), ".trae", "documents");

	try {
		await fs.mkdir(documentsDir, { recursive: true });
		const filePath = path.join(documentsDir, fileName);
		await fs.writeFile(filePath, content, "utf-8");
		return filePath;
	} catch (error) {
		console.error("保存文件时出错:", error);
		throw error;
	}
};

// 注册工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: "chat_summary",
				description:
					"分析聊天内容并生成包含技术栈、业务、标签、AI思考、问题分类、解决方案和总结的综合分析报告",
				inputSchema: {
					type: "object",
					properties: {
						chatContent: {
							type: "string",
							description: "需要分析的聊天内容",
						},
						filename: {
							type: "string",
							description: "可选的输出文件名（不包含扩展名）",
						},
						analysisConfig: {
							type: "object",
							description: "分析配置选项",
							properties: {
								enableTechStack: { type: "boolean", default: true },
								enableBusiness: { type: "boolean", default: true },
								enableTags: { type: "boolean", default: true },
								enableAIThoughts: { type: "boolean", default: true },
								enableProblems: { type: "boolean", default: true },
								enableSolutions: { type: "boolean", default: true },
								enableSummary: { type: "boolean", default: true },
							},
						},
					},
					required: ["chatContent"],
				},
			},
			{
				name: "update_ai_config",
				description:
					"更新AI提供商配置，支持配置不同的大模型提供商、API密钥和基础URL",
				inputSchema: {
					type: "object",
					properties: {
						provider: {
							type: "string",
							enum: ["deepseek", "openai", "anthropic", "azure", "custom"],
							description: "AI提供商",
						},
						apiKey: {
							type: "string",
							description: "API密钥",
						},
						baseUrl: {
							type: "string",
							description: "自定义API基础URL",
						},
						model: {
							type: "string",
							description: "模型名称",
						},
					},
					required: ["provider"],
				},
			},
			{
				name: "get_ai_config",
				description: "获取当前AI提供商配置",
				inputSchema: {
					type: "object",
					properties: {},
					required: [],
				},
			},
			{
				name: "reset_config",
				description: "重置所有配置为默认值",
				inputSchema: {
					type: "object",
					properties: {},
					required: [],
				},
			},
			{
				name: "quick_analysis",
				description: "快速分析聊天内容，生成简化报告",
				inputSchema: {
					type: "object",
					properties: {
						chatContent: {
							type: "string",
							description: "要分析的聊天内容",
						},
					},
					required: ["chatContent"],
				},
			},
			{
				name: "get_analysis_result",
				description: "根据ID获取分析结果",
				inputSchema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "分析结果的ID",
						},
					},
					required: ["id"],
				},
			},
			{
				name: "list_analysis_results",
				description: "获取所有分析结果列表（分页）",
				inputSchema: {
					type: "object",
					properties: {
						page: {
							type: "number",
							description: "页码，默认为1",
							default: 1,
						},
						limit: {
							type: "number",
							description: "每页数量，默认为10",
							default: 10,
						},
					},
				},
			},
			{
				name: "search_by_tech_stack",
				description: "根据技术栈搜索分析结果",
				inputSchema: {
					type: "object",
					properties: {
						techStack: {
							type: "string",
							description: "技术栈关键词",
						},
					},
					required: ["techStack"],
				},
			},
			{
				name: "search_by_business_domain",
				description: "根据业务领域搜索分析结果",
				inputSchema: {
					type: "object",
					properties: {
						domain: {
							type: "string",
							description: "业务领域关键词",
						},
					},
					required: ["domain"],
				},
			},
			{
				name: "delete_analysis_result",
				description: "删除分析结果",
				inputSchema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "要删除的分析结果ID",
						},
					},
					required: ["id"],
				},
			},
		],
	};
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	try {
		switch (name) {
			case "chat_summary": {
				console.log('🔍 开始执行聊天内容分析...');
				const {
					chatContent,
					filename,
					analysisConfig = {},
				} = args as {
					chatContent: string;
					filename?: string;
					analysisConfig?: {
						enableTechStack?: boolean;
						enableBusiness?: boolean;
						enableTags?: boolean;
						enableAIThoughts?: boolean;
						enableProblems?: boolean;
						enableSolutions?: boolean;
						enableSummary?: boolean;
					};
				};

				console.log(`📝 聊天内容长度: ${chatContent?.length || 0} 字符`);
				console.log(`📁 指定文件名: ${filename || '未指定'}`);
				console.log(`⚙️  分析配置:`, analysisConfig);

				if (!chatContent) {
					console.error('❌ 聊天内容为空');
					throw new Error("聊天内容不能为空");
				}

				// 加载配置
				console.log('📋 加载配置文件...');
				const config = await loadConfig();
				console.log('✅ 配置加载完成');

				// 初始化AI服务
				console.log('🤖 初始化AI服务...');
				const aiService = await getAIService();
				await aiService.initialize();
				console.log('✅ AI服务初始化完成');

				// 创建综合分析器（使用合并后的配置）
				console.log('⚙️  合并分析配置...');
				const mergedConfig = {
					...config.analysis,
					enableTechStack:
						analysisConfig.enableTechStack ?? config.analysis.enableTechStack,
					enableBusiness:
						analysisConfig.enableBusiness ?? config.analysis.enableBusiness,
					enableTags: analysisConfig.enableTags ?? config.analysis.enableTags,
					enableAIThoughts:
						analysisConfig.enableAIThoughts ?? config.analysis.enableAIThoughts,
					enableProblems:
						analysisConfig.enableProblems ?? config.analysis.enableProblems,
					enableSolutions:
						analysisConfig.enableSolutions ?? config.analysis.enableSolutions,
					enableSummary:
						analysisConfig.enableSummary ?? config.analysis.enableSummary,
				};
				console.log('📊 最终分析配置:', mergedConfig);

				// 创建综合分析器
				console.log('🔬 创建综合分析器实例...');
				const analyzer = new ComprehensiveAnalyzer(aiService, mergedConfig);

				// 执行综合分析
				console.log('🔍 开始执行综合分析...');
				const result = await analyzer.analyze(chatContent);
				console.log('✅ 综合分析完成');
				console.log('📊 分析结果概览:', {
					techStack: result.techStack?.primaryStack,
					business: result.business?.domain,
					problemsCount: result.problems?.length || 0,
					solutionsCount: result.solutions?.solutionApproaches?.length || 0
				});

				// 生成Markdown报告
				console.log('📄 生成Markdown报告...');
				const markdownGenerator = getMarkdownGenerator();
				const markdown = markdownGenerator.generateComprehensiveMarkdown(
					result,
					chatContent
				);
				console.log(`📄 Markdown报告生成完成，长度: ${markdown.length} 字符`);

				// 保存文件
				console.log('💾 保存Markdown文件...');
				const filePath = await saveMarkdownFile(markdown, filename);
				console.log(`✅ 文件保存成功: ${filePath}`);

				// 保存到数据库
				console.log('🗄️  开始保存到数据库...');
				try {
					const dbId = await saveAnalysisResult(result, chatContent, filename);
					console.log(`✅ 数据库保存成功，ID: ${dbId}`);
				} catch (dbError) {
					console.error('❌ 数据库保存失败，但文件保存成功:', dbError);
					console.error('🔍 数据库错误详情:', {
						name: dbError instanceof Error ? dbError.name : 'Unknown',
						message: dbError instanceof Error ? dbError.message : String(dbError),
						stack: dbError instanceof Error ? dbError.stack : undefined
					});
				}

				return {
					content: [
						{
							type: "text",
							text: `✅ 综合分析完成！\n\n📊 **分析结果概览**:\n${markdownGenerator.generateStatistics(
								result
							)}\n📁 **文件已保存**: ${filePath}\n\n🔍 **快速预览**:\n${markdownGenerator.generateSimpleReport(
								result
							)}`,
						},
					],
				};
			}

			case "update_ai_config": {
				const { provider, apiKey, baseUrl, model } = args as {
					provider: string;
					apiKey?: string;
					baseUrl?: string;
					model?: string;
				};

				// 更新AI提供商配置
				await updateAIConfig({
					provider: provider as "deepseek" | "openai" | "custom" | "claude",
					apiKey: apiKey || undefined,
					baseUrl: baseUrl || undefined,
					model: model || undefined,
				});

				// 重新初始化AI服务
				const config = await loadConfig();
				const aiService = await getAIService();
				await aiService.initialize();

				return {
					content: [
						{
							type: "text",
							text: `✅ AI配置已更新！\n\n**提供商**: ${provider}\n**模型**: ${
								model || "默认"
							}\n**基础URL**: ${baseUrl || "默认"}\n**API密钥**: ${
								apiKey ? "已设置" : "未设置"
							}`,
						},
					],
				};
			}

			case "get_ai_config": {
				const config = await loadConfig();
				const aiConfig = config.ai;

				return {
					content: [
						{
							type: "text",
							text: `📋 **当前AI配置**:\n\n**提供商**: ${
								aiConfig.provider
							}\n**模型**: ${aiConfig.model || "默认"}\n**基础URL**: ${
								aiConfig.baseUrl || "默认"
							}\n**API密钥**: ${
								aiConfig.apiKey ? "已设置" : "未设置"
							}\n\n**分析配置**:\n- 技术栈分析: ${
								config.analysis.enableTechStack ? "✅" : "❌"
							}\n- 业务分析: ${
								config.analysis.enableBusiness ? "✅" : "❌"
							}\n- 标签分析: ${
								config.analysis.enableTags ? "✅" : "❌"
							}\n- AI思考分析: ${
								config.analysis.enableAIThoughts ? "✅" : "❌"
							}\n- 问题分类: ${
								config.analysis.enableProblems ? "✅" : "❌"
							}\n- 解决方案分析: ${
								config.analysis.enableSolutions ? "✅" : "❌"
							}\n- 总结分析: ${config.analysis.enableSummary ? "✅" : "❌"}`,
						},
					],
				};
			}

			case "reset_config": {
				await resetConfig();

				return {
					content: [
						{
							type: "text",
							text: "✅ 配置已重置为默认值！",
						},
					],
				};
			}

			case "quick_analysis": {
				const { chatContent } = args as { chatContent: string };

				if (!chatContent) {
					throw new Error("聊天内容不能为空");
				}

				// 加载配置
				const config = await loadConfig();

				// 初始化AI服务
				const aiService = await getAIService();
				await aiService.initialize();

				// 创建快速分析配置
				const quickConfig = {
					...config.analysis,
					enableTechStack: true,
					enableBusiness: true,
					enableTags: true,
					enableAIThoughts: false,
					enableProblems: true,
					enableSolutions: false,
					enableSummary: true,
				};

				// 创建综合分析器
				const analyzer = new ComprehensiveAnalyzer(aiService, quickConfig);

				// 执行快速分析
				const result = await analyzer.analyze(chatContent);

				// 生成简化报告
				const markdownGenerator = getMarkdownGenerator();
				const quickReport = markdownGenerator.generateSimpleReport(result);

				return {
					content: [
						{
							type: "text",
							text: `⚡ **快速分析结果**:\n\n${quickReport}`,
						},
					],
				};
			}

			case "get_analysis_result": {
				const { id } = args as { id: string };

				if (!id) {
					throw new Error("分析结果ID不能为空");
				}

				const result = await getAnalysisResult(id);
				if (!result) {
					throw new Error(`未找到ID为 ${id} 的分析结果`);
				}

				return {
					content: [
						{
							type: "text",
							text: `📊 **分析结果详情**:\n\n**ID**: ${result.id}\n**创建时间**: ${result.createdAt.toLocaleString()}\n**文件名**: ${result.filename || '未指定'}\n**技术栈**: ${result.primaryStack || '未识别'}\n**业务领域**: ${result.businessDomain || '未识别'}\n**优先级**: ${result.priority || '未设置'}\n\n**Markdown报告**:\n\n${result.markdownReport}`,
						},
					],
				};
			}

			case "list_analysis_results": {
				const { page = 1, limit = 10 } = args as { page?: number; limit?: number };

				const results = await getAllAnalysisResults(page, limit);

				const resultsList = results.results.map((result: any) => 
					`- **${result.id}** | ${result.createdAt.toLocaleDateString()} | ${result.filename || '未命名'} | ${result.primaryStack || '未知技术栈'} | ${result.businessDomain || '未知领域'}`
				).join('\n');

				return {
					content: [
						{
							type: "text",
							text: `📋 **分析结果列表** (第${page}页，共${results.totalPages}页):\n\n${resultsList}\n\n**统计信息**:\n- 总数: ${results.total}\n- 当前页: ${page}/${results.totalPages}\n- 每页显示: ${limit}`,
						},
					],
				};
			}

			case "search_by_tech_stack": {
				const { techStack } = args as { techStack: string };

				if (!techStack) {
					throw new Error("技术栈关键词不能为空");
				}

				const results = await searchByTechStack(techStack);

				if (results.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `🔍 未找到包含技术栈 "${techStack}" 的分析结果`,
							},
						],
					};
				}

				const resultsList = results.map((result: any) => 
					`- **${result.id}** | ${result.createdAt.toLocaleDateString()} | ${result.filename || '未命名'} | ${result.primaryStack} | ${result.technologies.join(', ')}`
				).join('\n');

				return {
					content: [
						{
							type: "text",
							text: `🔍 **技术栈搜索结果** (关键词: "${techStack}"):\n\n${resultsList}\n\n找到 ${results.length} 个相关结果`,
						},
					],
				};
			}

			case "search_by_business_domain": {
				const { domain } = args as { domain: string };

				if (!domain) {
					throw new Error("业务领域关键词不能为空");
				}

				const results = await searchByBusinessDomain(domain);

				if (results.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `🔍 未找到包含业务领域 "${domain}" 的分析结果`,
							},
						],
					};
				}

				const resultsList = results.map((result: any) => 
					`- **${result.id}** | ${result.createdAt.toLocaleDateString()} | ${result.filename || '未命名'} | ${result.businessDomain} | ${result.subDomains.join(', ')}`
				).join('\n');

				return {
					content: [
						{
							type: "text",
							text: `🔍 **业务领域搜索结果** (关键词: "${domain}"):\n\n${resultsList}\n\n找到 ${results.length} 个相关结果`,
						},
					],
				};
			}

			case "delete_analysis_result": {
				const { id } = args as { id: string };

				if (!id) {
					throw new Error("分析结果ID不能为空");
				}

				// 先检查记录是否存在
				const existingResult = await getAnalysisResult(id);
				if (!existingResult) {
					throw new Error(`未找到ID为 ${id} 的分析结果`);
				}

				await deleteAnalysisResult(id);

				return {
					content: [
						{
							type: "text",
							text: `✅ 分析结果已删除\n\n**删除的记录**:\n- ID: ${id}\n- 文件名: ${existingResult.filename || '未命名'}\n- 创建时间: ${existingResult.createdAt.toLocaleString()}`,
						},
					],
				};
			}

			default:
				throw new Error(`未知的工具: ${name}`);
		}
	} catch (error) {
		console.error(`工具 ${name} 执行失败:`, error);
		return {
			content: [
				{
					type: "text",
					text: `❌ 执行失败: ${
						error instanceof Error ? error.message : "未知错误"
					}`,
				},
			],
			isError: true,
		};
	}
});

// 启动服务器的主函数
const main = async (): Promise<void> => {
	console.error("🔄 正在启动 AI协作档案分析器 v3.0...");
	
	// 检查数据库连接
	try {
		console.error("🗄️  检查数据库连接...");
		const { prisma } = await import('./database.js');
		await prisma.$connect();
		await prisma.$queryRaw`SELECT 1`;
		console.error("✅ 数据库连接正常");
	} catch (dbError) {
		console.error("⚠️  数据库连接失败，但服务器将继续启动:", dbError);
		console.error("🔍 数据库错误详情:", {
			name: dbError instanceof Error ? dbError.name : 'Unknown',
			message: dbError instanceof Error ? dbError.message : String(dbError)
		});
	}
	
	// 检查配置文件
	try {
		console.error("⚙️  检查配置文件...");
		const config = await loadConfig();
		console.error("✅ 配置文件加载成功");
		console.error("📋 当前配置:", {
			aiProvider: config.ai.provider,
			hasApiKey: !!config.ai.apiKey,
			analysisModules: Object.entries(config.analysis).filter(([_, enabled]) => enabled).map(([key]) => key)
		});
	} catch (configError) {
		console.error("⚠️  配置文件加载失败:", configError);
	}
	
	console.error("🌐 启动 MCP 服务器...");
	const transport = new StdioServerTransport();
	await server.connect(transport);
	
	console.error("🚀 AI协作档案分析器 v3.0 MCP服务器已启动");
	console.error(
		"📋 支持功能: 技术栈分析、业务分析、标签分析、AI思考分析、问题分类、解决方案分析、总结分析"
	);
	console.error("⚙️  支持配置: 多AI提供商、自定义API、模块化分析");
	console.error("📊 数据库功能: 分析结果持久化、历史记录查询、搜索过滤");
};

// 优雅关闭
process.on("SIGINT", async () => {
	console.error("\n🛑 正在关闭服务器...");
	try {
		await closeDatabaseConnection();
		console.error("📊 数据库连接已关闭");
	} catch (error) {
		console.error("❌ 关闭数据库连接时出错:", error);
	}
	process.exit(0);
});

main().catch((error) => {
	console.error("❌ 服务器启动失败:", error);
	process.exit(1);
});
