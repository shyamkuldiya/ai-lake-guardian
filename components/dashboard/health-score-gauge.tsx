'use client'

import { type HealthBand, HEALTH_BAND_CONFIG } from '@/lib/schemas/score'

interface HealthScoreGaugeProps {
  score: number
  band: HealthBand
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  trend?: {
    direction: 'up' | 'down' | 'stable'
    delta: number
  }
  animated?: boolean
}

const SIZE_CONFIG = {
  sm: { size: 80, strokeWidth: 6, fontSize: 'text-lg' },
  md: { size: 120, strokeWidth: 8, fontSize: 'text-2xl' },
  lg: { size: 160, strokeWidth: 10, fontSize: 'text-4xl' },
}

export function HealthScoreGauge({
  score,
  band,
  size = 'md',
  showLabel = true,
  trend,
  animated = true,
}: HealthScoreGaugeProps) {
  const config = SIZE_CONFIG[size]
  const bandConfig = HEALTH_BAND_CONFIG[band]

  const radius = (config.size - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const offset = circumference - progress

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{ width: config.size, height: config.size }}
      >
        {/* Background ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={config.size}
          height={config.size}
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-slate-700/50"
          />
          {/* Progress ring */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={bandConfig.color}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : offset}
            className="gauge-ring"
            style={{
              filter: `drop-shadow(0 0 6px ${bandConfig.color}40)`,
            }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold ${config.fontSize}`}
            style={{ color: bandConfig.color }}
          >
            {score}
          </span>
          {trend && (
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              {trend.direction === 'up' && '↑'}
              {trend.direction === 'down' && '↓'}
              {trend.direction === 'stable' && '→'}
              {Math.abs(trend.delta)}
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <span
          className="px-3 py-1 rounded-full text-sm font-medium health-badge"
          style={
            {
              '--health-color': bandConfig.color,
              color: bandConfig.color,
              background: bandConfig.bgColor,
            } as React.CSSProperties
          }
        >
          {bandConfig.label}
        </span>
      )}
    </div>
  )
}
