// 配置管理模块
import { AIProviderConfig, AnalysisConfig } from "./types.js";
import fs from "fs/promises";
import path from "path";
import os from "os";

// 默认配置
const DEFAULT_AI_CONFIG: AIProviderConfig = {
	provider: "deepseek",
	apiKey: "sk-6dea10bd0c894324b9773f7e91a520c1",
	baseUrl: "https://api.deepseek.com/v1/chat/completions",
	model: "deepseek-chat",
	temperature: 0.7,
	maxTokens: 2000,
};

const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig = {
	enableTechStack: true,
	enableBusiness: true,
	enableTags: true,
	enableAIThoughts: true,
	enableProblems: true,
	enableSummary: true,
};

// 配置文件路径
const getConfigPath = (): string => {
	return path.join(os.homedir(), ".mcp", "ai-collaboration-analyzer.json");
};

// 配置接口
export interface Config {
	ai: AIProviderConfig;
	analysis: AnalysisConfig;
}

// 加载配置
export const loadConfig = async (): Promise<Config> => {
	return {
		ai: DEFAULT_AI_CONFIG,
		analysis: DEFAULT_ANALYSIS_CONFIG,
	};
};

// 保存配置
export const saveConfig = async (config: Config): Promise<void> => {
	try {
		const configPath = getConfigPath();
		const configDir = path.dirname(configPath);

		// 确保配置目录存在
		await fs.mkdir(configDir, { recursive: true });

		// 保存配置
		await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
		console.log("配置已保存到:", configPath);
	} catch (error) {
		console.error("保存配置失败:", error);
		throw error;
	}
};

// 获取AI提供商配置
export const getAIConfig = async (): Promise<AIProviderConfig> => {
	const config = await loadConfig();
	return config.ai;
};

// 获取分析配置
export const getAnalysisConfig = async (): Promise<AnalysisConfig> => {
	const config = await loadConfig();
	return config.analysis;
};

// 更新AI配置
export const updateAIConfig = async (
	aiConfig: Partial<AIProviderConfig>
): Promise<void> => {
	const config = await loadConfig();
	config.ai = { ...config.ai, ...aiConfig };
	await saveConfig(config);
};


// 重置配置为默认值
export const resetConfig = async (): Promise<void> => {
	const config: Config = {
		ai: DEFAULT_AI_CONFIG,
		analysis: DEFAULT_ANALYSIS_CONFIG,
	};
	await saveConfig(config);
};

// 验证配置
export const validateConfig = (config: Config): string[] => {
	const errors: string[] = [];

	// 验证AI配置
	if (!config.ai.apiKey) {
		errors.push("AI API Key 不能为空");
	}

	if (!config.ai.provider) {
		errors.push("AI 提供商不能为空");
	}

	if (
		config.ai.temperature !== undefined &&
		(config.ai.temperature < 0 || config.ai.temperature > 2)
	) {
		errors.push("Temperature 必须在 0-2 之间");
	}

	if (config.ai.maxTokens !== undefined && config.ai.maxTokens < 1) {
		errors.push("Max Tokens 必须大于 0");
	}

	return errors;
};

// 获取配置示例
export const getConfigExample = (): Config => {
	return {
		ai: {
			provider: "deepseek",
			apiKey: "your-api-key-here",
			baseUrl: "https://api.deepseek.com/v1/chat/completions",
			model: "deepseek-chat",
			temperature: 0.7,
			maxTokens: 2000,
		},
		analysis: {
			enableTechStack: true,
			enableBusiness: true,
			enableTags: true,
			enableAIThoughts: true,
			enableProblems: true,
			enableSummary: true,
			customPrompts: {
				techStack: "自定义技术栈分析提示词",
				business: "自定义业务分析提示词",
				tags: "自定义标签分析提示词",
				aiThoughts: "自定义AI思考分析提示词",
				problems: "自定义问题分类提示词",
				summary: "自定义总结分析提示词",
			},
		},
	};
};
