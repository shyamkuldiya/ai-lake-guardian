'use client'

interface AIAnalysisPanelProps {
  score: number
  band: string
  lakeName: string
  isLoading?: boolean
}

export function AIAnalysisPanel({
  score,
  band,
  lakeName,
  isLoading,
}: AIAnalysisPanelProps) {
  if (isLoading) {
    return <div className="card p-6 animate-pulse h-48 bg-slate-800/50" />
  }

  // In a real app, this would come from the API (Gemini response)
  // For MVP, we construct a sensible message based on the score
  const getAnalysis = () => {
    if (score >= 80) {
      return {
        summary: `${lakeName} is currently in excellent condition. All virtual sensors indicate stable ecosystem parameters. Dissolved oxygen levels are optimal for aquatic life.`,
        upcoming:
          'No significant risks detected for the next 48 hours. Weather patterns are favorable.',
        action: 'Continue routine monitoring. No intervention required.',
      }
    } else if (score >= 60) {
      return {
        summary: `${lakeName} is showing early signs of stress. Minor fluctuations in turbidity and human activity levels have been detected.`,
        upcoming:
          'Potential for increased turbidity due to expected rainfall in 24 hours.',
        action:
          'Increase sampling frequency at inflow points. Monitor tourist density at major ghats.',
      }
    } else if (score >= 40) {
      return {
        summary: `${lakeName} is in a degrading state. Multiple indicators, including turbidity and algae bloom index, are outside optimal ranges.`,
        upcoming:
          'High risk of sewage overflow if rainfall continues as predicted.',
        action:
          'Activate rapid response team. Inspect sewage treatment plant divergence points immediately.',
      }
    } else {
      return {
        summary: `CRITICAL ALERT: ${lakeName} ecosystem health has dropped to dangerous levels. Severe eutrophication risk detected.`,
        upcoming:
          'Imminent risk of fish mortality event due to oxygen depletion.',
        action:
          'Immediate aeration required. Restrict public access to affected zones. Notify municipal authorities.',
      }
    }
  }

  const analysis = getAnalysis()

  return (
    <div className="glass card p-6 border-sky-500/30 relative overflow-hidden">
      {/* AI Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-start gap-4 relative z-10">
        <div className="mt-1 p-2 bg-sky-500/10 rounded-lg border border-sky-500/20 text-2xl">
          ✨
        </div>
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              AI Situation Analysis
              <span className="text-xs font-normal text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                Gemini Pro
              </span>
            </h3>
            <p className="text-slate-300 mt-2 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
            <div>
              <h4 className="text-xs font-semibold uppercase text-amber-400 mb-1">
                Upcoming Concerns
              </h4>
              <p className="text-sm text-slate-400">{analysis.upcoming}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-emerald-400 mb-1">
                Recommended Action
              </h4>
              <p className="text-sm text-slate-400">{analysis.action}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
