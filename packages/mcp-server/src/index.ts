#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// API 基础 URL，可以通过环境变量配置
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// 创建MCP服务器
const server = new Server(
	{
		name: "ai-summary-mcp-server",
		version: "4.0.0",
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
					"提交Bug修复相关的聊天内容进行分析，数据将通过API发送到远程服务器进行处理和存储",
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
					},
					required: ["chatContent"],
				},
			},
		],
	};
});

// HTTP 请求辅助函数
const makeAPICall = async (endpoint: string, data: any): Promise<any> => {
	const url = `${API_BASE_URL}${endpoint}`;
	
	console.log(`🌐 发送API请求到: ${url}`);
	console.log(`📦 请求数据大小: ${JSON.stringify(data).length} 字符`);
	
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
		}

		const result = await response.json();
		console.log(`✅ API请求成功`);
		return result;
	} catch (error) {
		console.error(`❌ API请求失败:`, error);
		throw error;
	}
};

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	try {
		switch (name) {
			case "bug_summary": {
				console.log("🔍 开始提交Bug修复内容分析...");
				const {
					chatContent,
					title,
					docTitle,
					docContent,
				} = args as {
					chatContent: string;
					title?: string;
					docTitle?: string;
					docContent?: string;
				};

				console.log(`📝 Bug修复内容长度: ${chatContent?.length || 0} 字符`);
				console.log(`📁 指定标题: ${title || "未指定"}`);
				console.log(`📄 文档标题: ${docTitle || "未指定"}`);
				console.log(`📝 文档内容长度: ${docContent?.length || 0} 字符`);

				if (!chatContent) {
					console.error("❌ 聊天内容为空");
					throw new Error("聊天内容不能为空");
				}

				// 准备发送到API的数据
				const requestData = {
					chatContent,
					title,
					docTitle,
					docContent,
					timestamp: new Date().toISOString(),
				};

				// 调用远程分析API
				console.log("🚀 发送数据到分析API...");
				const result = await makeAPICall('/analysis', requestData);

				console.log("✅ 分析提交完成");
				console.log("📊 API响应概览:", {
					success: result.success,
					id: result.id,
					message: result.message,
				});

				return {
					content: [
						{
							type: "text",
							text: `✅ Bug修复分析已提交！\n\n📊 **提交结果**:\n${
								result.success ? '✅ 提交成功' : '❌ 提交失败'
							}\n${result.message ? `📝 消息: ${result.message}` : ''}\n${
								result.id ? `🆔 分析ID: ${result.id}` : ''
							}\n\n数据已发送到远程服务器进行处理。`,
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
	console.error("🌐 启动 MCP 服务器...");
	console.error(`📡 API 基础URL: ${API_BASE_URL}`);
	
	const transport = new StdioServerTransport();
	await server.connect(transport);

	console.error("🚀 AI Summary MCP服务器 v4.0 已启动");
	console.error("📋 功能: 数据收集和API转发");
};

// 优雅关闭
process.on("SIGINT", async () => {
	console.error("\n🛑 正在关闭服务器...");
	console.error("👋 服务器已关闭");
	process.exit(0);
});

main().catch((error) => {
	console.error("❌ 服务器启动失败:", error);
	process.exit(1);
});