'use client'

interface ScoreRingProps {
  score: number
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: '#22c55e', text: 'text-green-400', label: '高度匹配' }
  if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-400', label: '基本匹配' }
  if (score >= 40) return { stroke: '#f97316', text: 'text-orange-400', label: '部分匹配' }
  return { stroke: '#ef4444', text: 'text-red-400', label: '匹配较弱' }
}

export default function ScoreRing({ score }: ScoreRingProps) {
  const size = 140
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const { stroke, text, label } = getScoreColor(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${text}`}>{score}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${text}`}>{label}</span>
    </div>
  )
}
