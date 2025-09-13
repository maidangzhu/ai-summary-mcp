#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { loadConfig } from "./config.js";
import { getAIService } from "./ai-service.js";
import { ComprehensiveAnalyzer } from "./analyzers.js";

import { saveAnalysisResult, closeDatabaseConnection } from "./database.js";

// 创建MCP服务器
const server = new Server(
	{
		name: "daily-thoughts-analyzer",
		version: "3.0.0",
	},
	{
		capabilities: {
			tools: {},
		},
	}
);

// 注册工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: "bug_summary",
				description:
					"分析Bug修复相关的聊天内容，生成包含技术栈、业务、标签、AI思考、问题分类和总结的综合分析报告，并生成技术文档",
				inputSchema: {
					type: "object",
					properties: {
						chatContent: {
							type: "string",
							description: "需要分析的Bug修复聊天内容",
						},
						title: {
							type: "string",
							description: "分析报告的标题",
						},
						docTitle: {
							type: "string",
							description: "技术文档的标题",
						},
						docContent: {
							type: "string",
							description: "技术文档的Markdown内容",
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
								enableSummary: { type: "boolean", default: true },
							},
						},
					},
					required: ["chatContent"],
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
			case "bug_summary": {
				console.log("🔍 开始执行Bug修复内容分析...");
				const {
					chatContent,
					title,
					docTitle,
					docContent,
					analysisConfig = {},
				} = args as {
					chatContent: string;
					title?: string;
					docTitle?: string;
					docContent?: string;
					analysisConfig?: {
						enableTechStack?: boolean;
						enableBusiness?: boolean;
						enableTags?: boolean;
						enableAIThoughts?: boolean;
						enableProblems?: boolean;
						enableSummary?: boolean;
					};
				};

				console.log(`📝 Bug修复内容长度: ${chatContent?.length || 0} 字符`);
				console.log(`📁 指定标题: ${title || "未指定"}`);
				console.log(`📄 文档标题: ${docTitle || "未指定"}`);
				console.log(`📝 文档内容长度: ${docContent?.length || 0} 字符`);
				console.log(`⚙️  分析配置:`, analysisConfig);

				if (!chatContent) {
					console.error("❌ 聊天内容为空");
					throw new Error("聊天内容不能为空");
				}

				// 加载配置
				console.log("📋 加载配置文件...");
				const config = await loadConfig();
				console.log("✅ 配置加载完成");

				// 初始化AI服务
				console.log("🤖 初始化AI服务...");
				const aiService = await getAIService();
				await aiService.initialize();
				console.log("✅ AI服务初始化完成");

				// 创建综合分析器（使用合并后的配置）
				console.log("⚙️  合并分析配置...");
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
					enableSummary:
						analysisConfig.enableSummary ?? config.analysis.enableSummary,
				};
				console.log("📊 最终分析配置:", mergedConfig);

				// 创建综合分析器
				console.log("🔬 创建综合分析器实例...");
				const analyzer = new ComprehensiveAnalyzer(aiService, mergedConfig);

				// 执行综合分析
				console.log("🔍 开始执行综合分析...");
				const result = await analyzer.analyze(chatContent);
				console.log("✅ 综合分析完成");
				console.log("📊 分析结果概览:", {
					techStack: result.techStack?.primaryStack,
					business: result.business?.business,
					problemsCount: result.problems?.length || 0,
				});

				// 分析完成
				console.log("✅ 分析完成");

				// 保存到数据库
				console.log("🗄️  开始保存到数据库...");
				saveAnalysisResult(result, chatContent, title, docTitle, docContent);

				return {
					content: [
						{
							type: "text",
							text: `✅ Bug修复分析完成！\n\n📊 **分析结果概览**:\n技术栈: ${
								result.techStack?.primaryStack || "未识别"
							}\n业务领域: ${
								result.business?.business || "未识别"
							}\n问题数量: ${result.problems?.length || 0}${
								docTitle ? `\n📄 技术文档: ${docTitle}` : ""
							}\n\n数据已保存到数据库中。`,
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
		const { prisma } = await import("./database.js");
		await prisma.$connect();
		await prisma.$queryRaw`SELECT 1`;
		console.error("✅ 数据库连接正常");
	} catch (dbError) {
		console.error("⚠️  数据库连接失败，但服务器将继续启动:", dbError);
		console.error("🔍 数据库错误详情:", {
			name: dbError instanceof Error ? dbError.name : "Unknown",
			message: dbError instanceof Error ? dbError.message : String(dbError),
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
			analysisModules: Object.entries(config.analysis)
				.filter(([_, enabled]) => enabled)
				.map(([key]) => key),
		});
	} catch (configError) {
		console.error("⚠️  配置文件加载失败:", configError);
	}

	console.error("🌐 启动 MCP 服务器...");
	const transport = new StdioServerTransport();
	await server.connect(transport);

	console.error("🚀 AI协作档案分析器 v3.0 MCP服务器已启动");
	console.error(
		"📋 支持功能: bug_summary - Bug修复内容综合分析（技术栈、业务、标签、AI思考、问题分类、总结、技术文档）"
	);
	console.error("⚙️  支持配置: 多AI提供商、自定义API、模块化分析");
	console.error("📊 数据库功能: 分析结果持久化存储");
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
