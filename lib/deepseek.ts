import OpenAI from 'openai'

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error(
    '[DeepSeek] 缺少环境变量 DEEPSEEK_API_KEY。\n' +
    '请复制 .env.local.example 为 .env.local 并填入你的 DeepSeek API Key。'
  )
}

/**
 * DeepSeek v3.2 客户端。
 * 使用 openai 包作为协议兼容层，baseURL 强制锁定 DeepSeek 官方端点。
 * 实际请求只会发往 https://api.deepseek.com，不会经过 OpenAI。
 */
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

export default deepseek
