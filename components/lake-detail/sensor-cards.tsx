'use client'

import type { SensorReading } from '@/lib/schemas/sensor'
import { SENSOR_DISPLAY_INFO } from '@/lib/schemas/sensor'
import { Card, CardContent } from '@/components/ui/card'

// Shadcn Progress is usually available. If not, I'll fallback to div.
// I'll stick to div with semantic classes to match Shadcn style if I'm not sure, but `components/ui/progress.tsx` likely exists or I can mock it.
// Let's use simple div for progress to be safe, but styled like Shadcn.

interface SensorCardsProps {
  sensors: SensorReading[]
  isLoading?: boolean
}

export function SensorCards({ sensors, isLoading = false }: SensorCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {sensors.map((sensor, index) => {
        const info = SENSOR_DISPLAY_INFO[sensor.sensorType]

        let statusColorClass = 'text-emerald-500'
        let barColorClass = 'bg-emerald-500'

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
          statusColorClass = 'text-destructive'
          barColorClass = 'bg-destructive'
        } else if (!isGood) {
          statusColorClass = 'text-amber-500'
          barColorClass = 'bg-amber-500'
        }

        return (
          <Card key={sensor.id} className="overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl" role="img" aria-label={info.label}>
                    {info.icon}
                  </span>
                  <span
                    className={`text-sm font-mono font-bold ${statusColorClass}`}
                  >
                    {Math.round(sensor.value)}%
                  </span>
                </div>
                <h4 className="text-xs font-medium text-muted-foreground leading-tight">
                  {info.label}
                </h4>
              </div>

              <div className="space-y-1.5">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${barColorClass}`}
                    style={{ width: `${sensor.value}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
