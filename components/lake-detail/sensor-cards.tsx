'use client'

import type { SensorReading } from '@/lib/schemas/sensor'
import { SENSOR_DISPLAY_INFO } from '@/lib/schemas/sensor'

interface SensorCardsProps {
  sensors: SensorReading[]
  isLoading?: boolean
}

export function SensorCards({ sensors, isLoading = false }: SensorCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="card p-4 animate-pulse h-32 bg-slate-800/50"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {sensors.map((sensor, index) => {
        const info = SENSOR_DISPLAY_INFO[sensor.sensorType]

        // Calculate status color based on value (simplified logic)
        // In a real app, each sensor would have its own thresholds
        let statusColor = 'text-emerald-400'
        let barColor = 'bg-emerald-500'

        // Invert logic for bad things (turbidity, algae, risk, pressure)
        const isInverse = [
          'turbidity',
          'algae_bloom_index',
          'rainfall_sewage_risk',
          'human_pressure',
        ].includes(sensor.sensorType)

        const value = sensor.value
        const isGood = isInverse ? value < 40 : value > 60
        const isBad = isInverse ? value > 70 : value < 40

        if (isBad) {
          statusColor = 'text-red-400'
          barColor = 'bg-red-500'
        } else if (!isGood) {
          statusColor = 'text-amber-400'
          barColor = 'bg-amber-500'
        }

        return (
          <div
            key={sensor.id}
            className={`card p-3 flex flex-col justify-between animate-scale-in stagger-${index + 1}`}
          >
            <div>
              <div className="flex items-start justify-between mb-1">
                <span className="text-xl" role="img" aria-label={info.label}>
                  {info.icon}
                </span>
                <span
                  className={`text-xs font-mono font-medium ${statusColor}`}
                >
                  {Math.round(sensor.value)}%
                </span>
              </div>
              <h4 className="text-xs font-medium text-slate-300 leading-tight">
                {info.label}
              </h4>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                  style={{ width: `${sensor.value}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-500">
                  Conf: {Math.round(sensor.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
