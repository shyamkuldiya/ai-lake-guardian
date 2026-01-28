'use client'

import type { LakeListItem } from '@/lib/schemas/lake'
import { HEALTH_BAND_CONFIG } from '@/lib/schemas/score'

interface StatsOverviewProps {
  lakes: LakeListItem[]
  alertCount?: number
}

export function StatsOverview({ lakes, alertCount = 0 }: StatsOverviewProps) {
  // Calculate stats
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
      color: 'text-sky-400',
    },
    {
      label: 'Average Score',
      value: avgScore,
      icon: '📊',
      color:
        avgScore >= 70
          ? 'text-emerald-400'
          : avgScore >= 50
            ? 'text-amber-400'
            : 'text-red-400',
    },
    {
      label: 'Healthy',
      value: healthyCount,
      icon: '✓',
      color: 'text-emerald-400',
    },
    {
      label: 'At Risk',
      value: atRiskCount,
      icon: '⚠',
      color: atRiskCount > 0 ? 'text-amber-400' : 'text-slate-400',
    },
    {
      label: 'Active Alerts',
      value: alertCount,
      icon: '🔔',
      color: alertCount > 0 ? 'text-red-400' : 'text-slate-400',
    },
  ]

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <span>📊</span>
        Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`text-center animate-scale-in stagger-${index + 1}`}
          >
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
