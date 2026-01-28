'use client'

import type { Prediction } from '@/lib/schemas/prediction'
import {
  RISK_LEVEL_CONFIG,
  PREDICTION_WINDOW_LABELS,
} from '@/lib/schemas/prediction'

interface PredictionPanelProps {
  predictions: Prediction[]
  isLoading?: boolean
}

export function PredictionPanel({
  predictions,
  isLoading = false,
}: PredictionPanelProps) {
  if (isLoading) {
    return <div className="card p-6 animate-pulse h-64 bg-slate-800/50" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {predictions.map((prediction, index) => {
        const riskConfig = RISK_LEVEL_CONFIG[prediction.riskLevel]
        const isPositive = prediction.scoreDelta >= 0

        return (
          <div
            key={prediction.id}
            className={`card p-4 flex flex-col animate-slide-in-right stagger-${index + 1}`}
            style={{
              borderColor: `${riskConfig.color}30`,
              background: `linear-gradient(to bottom right, ${riskConfig.bgColor}, transparent)`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                {PREDICTION_WINDOW_LABELS[prediction.window]}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={{
                  color: riskConfig.color,
                  background: `${riskConfig.color}20`,
                }}
              >
                {riskConfig.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-slate-100">
                {prediction.predictedScore}
              </span>
              <span
                className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {isPositive ? '↑' : '↓'} {Math.abs(prediction.scoreDelta)}
              </span>
            </div>

            <div className="mt-auto space-y-3">
              <div>
                <h5 className="text-xs uppercase text-slate-500 font-semibold mb-1">
                  Primary Factor
                </h5>
                <p className="text-sm text-slate-300 line-clamp-2">
                  {prediction.causes[0]}
                </p>
              </div>

              <div>
                <h5 className="text-xs uppercase text-slate-500 font-semibold mb-1">
                  Recommendation
                </h5>
                <p className="text-sm text-slate-300 line-clamp-2">
                  {prediction.recommendations[0]}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
