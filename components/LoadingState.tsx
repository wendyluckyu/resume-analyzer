'use client'

const steps = [
  '解析简历内容结构...',
  '提取 JD 核心要求...',
  '进行语义匹配分析...',
  '生成优化建议...',
]

export default function LoadingState() {
  return (
    <div className="card flex flex-col items-center gap-6 py-12 animate-fade-in">
      {/* Spinner */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-brand-300 animate-spin-slow" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-slate-200">DeepSeek v3.2 分析中</p>
        <p className="text-xs text-slate-500">通常需要 10 - 30 秒</p>
      </div>

      {/* Step list */}
      <div className="w-full max-w-xs space-y-2">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-xs text-slate-500"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-brand-500 opacity-60" />
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}
