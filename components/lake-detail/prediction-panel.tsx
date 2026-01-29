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

export function PredictionPanel({
  predictions,
  isLoading = false,
}: PredictionPanelProps) {
  if (isLoading) {
    return <div className="h-64 bg-muted/20 animate-pulse rounded-xl" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {predictions.map((prediction) => {
        const riskConfig = RISK_LEVEL_CONFIG[prediction.riskLevel]
        const isPositive = prediction.scoreDelta >= 0

        // Map risk to semantic colors
        let borderColor = ''
        if (prediction.riskLevel === 'critical')
          borderColor = 'border-destructive'
        else if (prediction.riskLevel === 'high')
          borderColor = 'border-destructive/70'
        else if (prediction.riskLevel === 'medium')
          borderColor = 'border-amber-500'

        return (
          <Card key={prediction.id} className={`${borderColor} h-full`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {PREDICTION_WINDOW_LABELS[prediction.predictionWindow]}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="font-normal capitalize"
                  style={{
                    color: riskConfig.color,
                    borderColor: `${riskConfig.color}40`,
                  }}
                >
                  {riskConfig.label} Risk
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tighter">
                  {prediction.predictedScore}
                </span>
                <span
                  className={`text-sm font-medium flex items-center ${isPositive ? 'text-emerald-500' : 'text-destructive'}`}
                >
                  {isPositive ? '↑' : '↓'} {Math.abs(prediction.scoreDelta)} pts
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Primary Factor
                  </h5>
                  <p className="text-sm leading-snug">{prediction.causes[0]}</p>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Recommendation
                  </h5>
                  <p className="text-sm leading-snug">
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
