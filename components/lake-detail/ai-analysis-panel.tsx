'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AIAnalysisPanelProps {
  score: number
  band: string
  lakeName: string
  isLoading?: boolean
}

import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons'

export function AIAnalysisPanel({
  score,
  band,
  lakeName,
  isLoading,
}: AIAnalysisPanelProps) {
  if (isLoading) {
    return <div className="h-48 bg-muted/20 animate-pulse rounded-2xl" />
  }

  // Sensible message based on score
  const getAnalysis = () => {
    if (score >= 80) {
      return {
        summary: `${lakeName} is currently in excellent condition. All virtual sensors indicate stable ecosystem parameters. Dissolved oxygen levels are optimal for aquatic life.`,
        upcoming:
          'No significant risks detected for the next 48 hours. Weather patterns are favorable.',
        action: 'Continue routine monitoring. No intervention required.',
        color: 'emerald',
      }
    } else if (score >= 60) {
      return {
        summary: `${lakeName} is showing early signs of stress. Minor fluctuations in turbidity and human activity levels have been detected.`,
        upcoming:
          'Potential for increased turbidity due to expected rainfall in 24 hours.',
        action:
          'Increase sampling frequency at inflow points. Monitor tourist density at major ghats.',
        color: 'amber',
      }
    } else if (score >= 40) {
      return {
        summary: `${lakeName} is in a degrading state. Multiple indicators, including turbidity and algae bloom index, are outside optimal ranges.`,
        upcoming:
          'High risk of sewage overflow if rainfall continues as predicted.',
        action:
          'Activate rapid response team. Inspect sewage treatment plant divergence points immediately.',
        color: 'orange',
      }
    } else {
      return {
        summary: `CRITICAL ALERT: ${lakeName} ecosystem health has dropped to dangerous levels. Severe eutrophication risk detected.`,
        upcoming:
          'Imminent risk of fish mortality event due to oxygen depletion.',
        action:
          'Immediate aeration required. Restrict public access to affected zones. Notify municipal authorities.',
        color: 'red',
      }
    }
  }

  const analysis = getAnalysis()

  return (
    <Card className="border-primary/10 bg-primary/5 overflow-hidden relative rounded-2xl shadow-sm">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-background border border-primary/20 rounded-xl shadow-sm text-primary">
            <HugeiconsIcon
              icon={SparklesIcon}
              className="size-6"
              strokeWidth={2}
            />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              AI Guardian Analysis
              <Badge
                variant="outline"
                className="font-bold text-[10px] uppercase tracking-widest text-primary/70 bg-primary/5 border-primary/20"
              >
                Gemini Pro 1.5
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Predictive Ecology Engine
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-8 pb-8">
        <div className="text-foreground/90 text-lg leading-relaxed font-medium bg-background/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-inner">
          {analysis.summary}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="size-4 text-amber-500"
                strokeWidth={2.5}
              />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600/80">
                Forecasted Risks
              </h4>
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed pl-6 border-l-2 border-amber-500/30 font-jetbrains">
              {analysis.upcoming}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                className="size-4 text-emerald-500"
                strokeWidth={2.5}
              />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/80">
                Operational Guidance
              </h4>
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed pl-6 border-l-2 border-emerald-500/30 font-jetbrains">
              {analysis.action}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
