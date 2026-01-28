'use client'

import type { LakeListItem } from '@/lib/schemas/lake'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  const stats = [
    {
      label: 'Lakes Monitored',
      value: totalLakes,
      icon: '🌊',
      description: 'Active Monitoring',
    },
    {
      label: 'Average Score',
      value: avgScore,
      icon: '📊',
      description: 'Across all lakes',
    },
    {
      label: 'Healthy Lakes',
      value: healthyCount,
      icon: '✅',
      description: 'Optimal conditions',
    },
    {
      label: 'At Risk',
      value: atRiskCount,
      icon: '⚠️',
      description: 'Require attention',
    },
    {
      label: 'Active Alerts',
      value: alertCount,
      icon: '🔔',
      description: 'Critical events',
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          System Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground/60 mt-1">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
