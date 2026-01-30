'use client'

import type { LakeListItem } from '@/lib/schemas/lake'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  WaveIcon,
  Analytics01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Notification03Icon,
} from '@hugeicons/core-free-icons'

interface StatsOverviewProps {
  lakes: LakeListItem[]
  alertCount?: number
}

export function StatsOverview({ lakes, alertCount = 0 }: StatsOverviewProps) {
  const totalLakes = lakes.length
  const avgScore =
    lakes.filter((l) => l.currentScore !== null).length > 0
      ? Math.round(
          lakes
            .filter((l) => l.currentScore !== null)
            .reduce((sum, l) => sum + (l.currentScore ?? 0), 0) /
            lakes.filter((l) => l.currentScore !== null).length
        )
      : 0

  const atRiskCount = lakes.filter(
    (l) =>
      l.band === 'at_risk' || l.band === 'degrading' || l.band === 'critical'
  ).length

  const healthyCount = lakes.filter((l) => l.band === 'healthy').length

  const stats: {
    label: string
    value: number | string
    icon: IconSvgElement
    color: string
    description: string
  }[] = [
    {
      label: 'Lakes Monitored',
      value: totalLakes,
      icon: WaveIcon,
      color: 'text-blue-500',
      description: 'Active Monitoring',
    },
    {
      label: 'Average Score',
      value: avgScore,
      icon: Analytics01Icon,
      color: 'text-primary',
      description: 'Across all lakes',
    },
    {
      label: 'Healthy Lakes',
      value: healthyCount,
      icon: CheckmarkCircle01Icon,
      color: 'text-emerald-500',
      description: 'Optimal conditions',
    },
    {
      label: 'At Risk',
      value: atRiskCount,
      icon: AlertCircleIcon,
      color: 'text-amber-500',
      description: 'Require attention',
    },
    {
      label: 'Active Alerts',
      value: alertCount,
      icon: Notification03Icon,
      color: 'text-destructive',
      description: 'Critical events',
    },
  ]
  return (
    <Card className="w-full border-muted/50 shadow-sm overflow-hidden rounded-2xl bg-linear-to-b from-background to-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          System Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col p-6 rounded-2xl bg-background border border-muted/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-primary/5 transition-colors">
                  <HugeiconsIcon
                    icon={stat.icon}
                    className={`size-6 ${stat.color}`}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-3 flex items-center gap-1 font-medium">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
