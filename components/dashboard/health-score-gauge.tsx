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
  const radius = (config.size - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const offset = circumference - progress

  // Use HSL variables for color
  const colorVar = `var(--color-${band})`

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{ width: config.size, height: config.size }}
      >
        {/* Background ring */}
        <svg
          className="-rotate-90 transform"
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
            className="text-muted/30"
          />
          {/* Progress ring */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={`hsl(${colorVar})`}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 4px hsl(${colorVar} / 0.5))`,
            }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold ${config.fontSize}`}
            style={{ color: `hsl(${colorVar})` }}
          >
            {score}
          </span>
          {trend && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
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
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{
            color: `hsl(${colorVar})`,
            backgroundColor: `hsl(${colorVar} / 0.1)`,
            border: `1px solid hsl(${colorVar} / 0.2)`,
          }}
        >
          {HEALTH_BAND_CONFIG[band].label}
        </span>
      )}
    </div>
  )
}
