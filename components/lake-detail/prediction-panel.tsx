'use client'

import type { Prediction } from '@/lib/schemas/prediction'
import {
  RISK_LEVEL_CONFIG,
  PREDICTION_WINDOW_LABELS,
} from '@/lib/schemas/prediction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PredictionPanelProps {
  predictions: Prediction[]
  isLoading?: boolean
}

import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  ZapIcon,
  Idea01Icon,
} from '@hugeicons/core-free-icons'

export function PredictionPanel({
  predictions,
  isLoading = false,
}: PredictionPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {predictions.map((prediction) => {
        const riskConfig = RISK_LEVEL_CONFIG[prediction.riskLevel]
        const isPositive = prediction.scoreDelta >= 0

        return (
          <Card
            key={prediction.id}
            className="relative group transition-all duration-300 hover:shadow-xl border-muted/50 rounded-2xl overflow-hidden flex flex-col h-full bg-linear-to-br from-background to-muted/10"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: riskConfig.color }}
            />

            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-full">
                  {PREDICTION_WINDOW_LABELS[prediction.predictionWindow]}
                </span>
                <Badge
                  variant="outline"
                  className="font-bold text-[9px] uppercase tracking-widest px-2 py-0"
                  style={{
                    color: riskConfig.color,
                    borderColor: `${riskConfig.color}40`,
                    backgroundColor: `${riskConfig.color}10`,
                  }}
                >
                  {riskConfig.label} Risk
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 flex-1 flex flex-col pt-0">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black tracking-tighter group-hover:scale-105 transition-transform">
                  {prediction.predictedScore}
                </div>
                <div
                  className={cn(
                    'flex flex-col items-start gap-0.5 px-3 py-1.5 rounded-xl border font-bold text-xs',
                    isPositive
                      ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20'
                      : 'text-destructive bg-destructive/5 border-destructive/20'
                  )}
                >
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon
                      icon={isPositive ? ArrowUp01Icon : ArrowDown01Icon}
                      className="size-3"
                      strokeWidth={3}
                    />
                    <span>{Math.abs(prediction.scoreDelta)} pts</span>
                  </div>
                  <span className="text-[8px] uppercase tracking-wider opacity-70">
                    Shift
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="space-y-2 p-3 rounded-xl bg-background/50 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={ZapIcon}
                      className="size-3 text-primary"
                      strokeWidth={3}
                    />
                    <h5 className="text-[9px] font-black tracking-widest uppercase text-muted-foreground">
                      Primary Vector
                    </h5>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed tracking-tight">
                    {prediction.causes[0]}
                  </p>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-primary/5 border border-primary/10 shadow-inner">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Idea01Icon}
                      className="size-3 text-amber-500"
                      strokeWidth={3}
                    />
                    <h5 className="text-[9px] font-black tracking-widest uppercase text-muted-foreground">
                      Recommedation
                    </h5>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed tracking-tight text-foreground/80">
                    {prediction.recommendations[0]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
