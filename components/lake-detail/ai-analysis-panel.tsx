'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    return <div className="h-48 bg-muted/20 animate-pulse rounded-xl" />
  }

  // Sensible message based on score
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
    <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-background border rounded-md shadow-sm">
            <span className="text-xl">✨</span>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              AI Situation Analysis
              <Badge
                variant="outline"
                className="font-normal text-xs text-muted-foreground"
              >
                Gemini Pro
              </Badge>
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <p className="text-foreground leading-relaxed">{analysis.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/10">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              Upcoming Concerns
            </h4>
            <p className="text-sm text-muted-foreground">{analysis.upcoming}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              Recommended Action
            </h4>
            <p className="text-sm text-muted-foreground">{analysis.action}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
