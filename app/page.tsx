'use client'

import { useState } from 'react'
import type { AnalysisResult } from './types'
import AnalysisResultPanel from '@/components/AnalysisResult'
import LoadingState from '@/components/LoadingState'

const RESUME_PLACEHOLDER = `粘贴您的简历内容（纯文本格式）

例如：

张三
前端开发工程师 | zhangsan@email.com | 138xxxx1234

工作经历
字节跳动 | 前端开发工程师 | 2021.07 - 至今
- 负责抖音 Web 端核心业务模块开发，累计覆盖用户 5000 万+
- 主导性能优化项目，LCP 指标从 4.2s 降至 1.8s，降幅 57%
- 封装通用组件库，被 10+ 业务团队复用...

技术栈
React / TypeScript / Next.js / Node.js / GraphQL`

const JD_PLACEHOLDER = `粘贴目标职位的职位描述（JD）

例如：

职位：高级前端开发工程师
公司：某科技公司

职责描述：
- 负责公司核心产品前端架构设计与开发
- 参与技术选型，推动前端工程化建设
- 优化页面性能，保障用户体验

任职要求：
- 3年以上前端开发经验
- 精通 React / Vue 等主流框架
- 有大型项目性能优化经验
- 熟悉 Node.js，有全栈经验优先`

export default function HomePage() {
  const [resume, setResume] = useState('')
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canAnalyze = resume.trim().length > 50 && jd.trim().length > 50

  async function handleAnalyze() {
    if (!canAnalyze || loading) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jd }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '请求失败，请稍后重试')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-600/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Powered by DeepSeek v3.2
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            AI 简历
            <span className="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
              {' '}匹配分析
            </span>
          </h1>
          <p className="mt-3 text-base text-slate-400 max-w-xl mx-auto">
            粘贴简历和 JD，AI 深度分析匹配度，给出精准可落地的优化建议
          </p>
        </header>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Input panel */}
          <div className="space-y-4">
            {/* Resume input */}
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200">
                  简历内容
                </label>
                <span className="text-xs text-slate-500">{resume.length} 字</span>
              </div>
              <textarea
                className="textarea-base h-72"
                placeholder={RESUME_PLACEHOLDER}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                maxLength={8000}
              />
            </div>

            {/* JD input */}
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200">
                  职位描述（JD）
                </label>
                <span className="text-xs text-slate-500">{jd.length} 字</span>
              </div>
              <textarea
                className="textarea-base h-56"
                placeholder={JD_PLACEHOLDER}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                maxLength={4000}
              />
            </div>

            {/* Action button */}
            <button
              className="btn-primary w-full py-4 text-base"
              onClick={handleAnalyze}
              disabled={!canAnalyze || loading}
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  分析中...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  开始 AI 分析
                </>
              )}
            </button>

            {!canAnalyze && !loading && (
              <p className="text-center text-xs text-slate-500">
                简历和 JD 各需至少 50 字才能开始分析
              </p>
            )}
          </div>

          {/* Right: Result panel */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {/* Empty state */}
            {!loading && !result && !error && (
              <div className="card flex flex-col items-center gap-4 py-16 text-center animate-fade-in">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <svg className="h-10 w-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">等待分析</p>
                  <p className="mt-1 text-xs text-slate-500">
                    填写左侧内容后，点击「开始 AI 分析」
                  </p>
                </div>

                {/* Feature hints */}
                <div className="mt-2 grid grid-cols-2 gap-3 w-full max-w-sm">
                  {[
                    { icon: '📊', text: '综合匹配评分' },
                    { icon: '🔑', text: '关键词差异分析' },
                    { icon: '✨', text: '匹配优势识别' },
                    { icon: '🎯', text: '可落地修改建议' },
                  ].map(({ icon, text }) => (
                    <div
                      key={text}
                      className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-left"
                    >
                      <span className="text-lg">{icon}</span>
                      <p className="mt-1 text-xs text-slate-400">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && <LoadingState />}

            {/* Error state */}
            {error && !loading && (
              <div className="card border-red-500/30 bg-red-500/5 animate-fade-in">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-400">分析失败</p>
                    <p className="mt-1 text-xs text-slate-400">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-4 w-full rounded-lg border border-slate-700 py-2 text-xs text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
                >
                  重置
                </button>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <>
                <AnalysisResultPanel result={result} />
                <button
                  onClick={handleReset}
                  className="w-full rounded-xl border border-slate-700 py-3 text-sm text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
                >
                  重新分析
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-600">
          <p>简历内容仅在分析时传输，不做任何存储</p>
        </footer>
      </div>
    </div>
  )
}
