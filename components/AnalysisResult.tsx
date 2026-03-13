'use client'

import type { AnalysisResult } from '@/app/types'
import ScoreRing from './ScoreRing'

interface AnalysisResultProps {
  result: AnalysisResult
}

const categoryIcons: Record<string, string> = {
  '工作经历': '💼',
  '技能描述': '⚙️',
  '项目经验': '🚀',
  '教育背景': '🎓',
}

function getCategoryIcon(category: string) {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.includes(key)) return icon
  }
  return '✏️'
}

export default function AnalysisResultPanel({ result }: AnalysisResultProps) {
  return (
    <div className="animate-slide-up space-y-5">
      {/* Score + Summary */}
      <div className="card flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing score={result.score} />
        <div className="flex-1">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            综合评估
          </h3>
          <p className="text-sm leading-relaxed text-slate-700">{result.summary}</p>
        </div>
      </div>

      {/* Keywords */}
      <div className="card space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          关键词匹配
        </h3>
        {result.keywords.matched.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-green-600 font-medium">已匹配 ({result.keywords.matched.length})</p>
            <div className="flex flex-wrap gap-2">
              {result.keywords.matched.map((kw) => (
                <span key={kw} className="tag bg-green-50 text-green-700 border border-green-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
        {result.keywords.missing.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-red-500 font-medium">缺失 ({result.keywords.missing.length})</p>
            <div className="flex flex-wrap gap-2">
              {result.keywords.missing.map((kw) => (
                <span key={kw} className="tag bg-red-50 text-red-600 border border-red-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-green-600">
            匹配优势
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-0.5 shrink-0 text-green-500">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            能力差距
          </h3>
          <ul className="space-y-2">
            {result.gaps.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-0.5 shrink-0 text-amber-400">△</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="card space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          优化建议
        </h3>
        <div className="space-y-4">
          {result.suggestions.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{getCategoryIcon(s.category)}</span>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
                  {s.category}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">问题：</span>
                {s.issue}
              </p>
              <p className="text-xs text-slate-700">
                <span className="font-medium text-brand-600">建议：</span>
                {s.action}
              </p>
              {s.example && (
                <div className="rounded-lg bg-brand-50 border border-brand-100 p-3">
                  <p className="text-xs text-slate-400 font-medium mb-1">示例</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
