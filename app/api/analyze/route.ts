import { NextRequest, NextResponse } from 'next/server'
import deepseek from '@/lib/deepseek'
import type { AnalyzeRequest, AnalysisResult } from '@/app/types'

const SYSTEM_PROMPT = `你是一位顶级职业顾问，专注于简历与职位描述（JD）的智能匹配分析。

你的任务：
1. 深度分析用户简历与 JD 的契合程度
2. 识别匹配的优势与缺失的关键能力
3. 给出具体、可落地的简历优化建议

输出要求：
- 必须返回纯 JSON 格式，不包含任何 markdown 代码块或额外文字
- 所有文字内容使用中文
- 建议必须具体可操作，不能泛泛而谈

JSON 结构如下：
{
  "score": <0-100 整数，综合匹配分>,
  "summary": "<2-3句话的整体评价>",
  "strengths": ["<优势1>", "<优势2>"],
  "gaps": ["<差距1>", "<差距2>"],
  "suggestions": [
    {
      "category": "<类别，如：工作经历 / 技能描述 / 项目经验 / 教育背景>",
      "issue": "<当前问题>",
      "action": "<具体修改动作>",
      "example": "<修改示例（可选）>"
    }
  ],
  "keywords": {
    "matched": ["<JD关键词，简历中已体现>"],
    "missing": ["<JD关键词，简历中缺失>"]
  }
}`

export async function POST(req: NextRequest) {
  // 1. 解析请求体
  let body: AnalyzeRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误，请重试' }, { status: 400 })
  }

  const { resume, jd } = body

  // 2. 输入校验
  if (!resume?.trim() || !jd?.trim()) {
    return NextResponse.json({ error: '简历和职位描述均不能为空' }, { status: 400 })
  }
  if (resume.trim().length < 50) {
    return NextResponse.json({ error: '简历内容过短，请至少输入 50 字' }, { status: 400 })
  }
  if (jd.trim().length < 50) {
    return NextResponse.json({ error: 'JD 内容过短，请至少输入 50 字' }, { status: 400 })
  }
  if (resume.length > 8000) {
    return NextResponse.json({ error: '简历内容过长，请控制在 8000 字以内' }, { status: 400 })
  }
  if (jd.length > 4000) {
    return NextResponse.json({ error: 'JD 内容过长，请控制在 4000 字以内' }, { status: 400 })
  }

  // 3. 调用 DeepSeek v3.2
  let rawContent: string
  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',          // DeepSeek v3.2 官方模型 ID
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `【简历内容】\n${resume}\n\n【职位描述（JD）】\n${jd}\n\n请对以上简历与JD进行深度匹配分析，返回 JSON 结果。`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    })

    rawContent = response.choices[0]?.message?.content ?? ''
    if (!rawContent) {
      return NextResponse.json({ error: 'DeepSeek 返回内容为空，请重试' }, { status: 502 })
    }
  } catch (err: unknown) {
    console.error('[DeepSeek API error]', err)
    const msg = err instanceof Error ? err.message : String(err)
    // 鉴权失败给明确提示
    if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('Authentication')) {
      return NextResponse.json(
        { error: 'DeepSeek API Key 无效或已过期，请检查 DEEPSEEK_API_KEY 环境变量' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: `调用 DeepSeek API 失败：${msg}` },
      { status: 502 }
    )
  }

  // 4. JSON 解析（含兜底）
  let result: AnalysisResult
  try {
    result = JSON.parse(rawContent)
  } catch {
    console.error('[JSON parse error] raw content:', rawContent.slice(0, 500))
    return NextResponse.json(
      { error: 'AI 返回内容解析失败，请重试。若持续出现请缩短输入长度。' },
      { status: 502 }
    )
  }

  // 5. 结构校验
  if (
    typeof result.score !== 'number' ||
    !result.summary ||
    !Array.isArray(result.strengths) ||
    !Array.isArray(result.gaps) ||
    !Array.isArray(result.suggestions) ||
    !result.keywords
  ) {
    console.error('[Validation error] unexpected structure:', JSON.stringify(result).slice(0, 300))
    return NextResponse.json(
      { error: 'AI 返回数据结构异常，请重试' },
      { status: 502 }
    )
  }

  return NextResponse.json(result)
}
