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

import { HugeiconsIcon } from '@hugeicons/react'
import {
  TornadoIcon,
  WaveIcon,
  TemperatureIcon,
  AiCloudIcon,
  RainIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

export function SensorCards({ sensors, isLoading = false }: SensorCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  const iconMap: Record<string, any> = {
    dissolved_oxygen: TornadoIcon,
    turbidity: WaveIcon,
    water_temperature: TemperatureIcon,
    algae_bloom_index: AiCloudIcon,
    rainfall_sewage_risk: RainIcon,
    human_pressure: UserGroupIcon,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {sensors.map((sensor, index) => {
        const info = SENSOR_DISPLAY_INFO[sensor.sensorType]
        const Icon = iconMap[sensor.sensorType]

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
          <Card
            key={sensor.id}
            className="group relative overflow-hidden rounded-2xl border-muted/50 transition-all  hover:border-primary/20"
          >
            <CardContent className="p-5 h-full flex flex-col justify-between gap-6 relative">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors">
                    <HugeiconsIcon
                      icon={Icon}
                      className="size-5 text-muted-foreground group-hover:text-primary transition-colors"
                      strokeWidth={2}
                    />
                  </div>
                  <span
                    className={`text-sm font-black tracking-tighter ${statusColorClass}`}
                  >
                    {Math.round(sensor.value)}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                  {info.label.replace(' & ', '\n& ')}
                </h4>
              </div>

              <div className="space-y-2">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
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
