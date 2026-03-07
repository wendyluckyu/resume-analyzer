export interface Suggestion {
  category: string
  issue: string
  action: string
  example?: string
}

export interface AnalysisResult {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  suggestions: Suggestion[]
  keywords: {
    matched: string[]
    missing: string[]
  }
}

export interface AnalyzeRequest {
  resume: string
  jd: string
}
