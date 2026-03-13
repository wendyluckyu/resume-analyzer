import Link from 'next/link'

const outputs = [
  '综合匹配评分',
  '关键词缺口',
  '匹配优势识别',
  '可落地优化建议',
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">简历匹配分析</span>
          <Link href="/analyze" className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors">
            开始使用 →
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-14">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs text-brand-600">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Powered by DeepSeek v3.2
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          看清简历与 JD 的真实差距
        </h1>

        {/* Subline */}
        <p className="mt-5 max-w-xl text-center text-base leading-relaxed text-slate-500">
          粘贴简历和职位描述，AI 输出结构化分析报告——帮你更快判断是否值得投递，以及如何有针对性地修改。
        </p>

        {/* CTA */}
        <div className="mt-8">
          <Link href="/analyze" className="btn-primary px-8 py-3.5 text-base">
            免费开始分析 →
          </Link>
        </div>

        {/* Output hints */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {outputs.map((label) => (
            <span
              key={label}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs text-slate-500"
            >
              {label}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-slate-400">
        简历内容仅在分析时传输，不做任何存储
      </footer>
    </div>
  )
}
