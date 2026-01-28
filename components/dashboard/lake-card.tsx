'use client'

import Link from 'next/link'
import type { LakeListItem } from '@/lib/schemas/lake'
import { HEALTH_BAND_CONFIG } from '@/lib/schemas/score'
import { HealthScoreGauge } from './health-score-gauge'

interface LakeCardProps {
  lake: LakeListItem
  isSelected?: boolean
  onClick?: () => void
}

export function LakeCard({ lake, isSelected, onClick }: LakeCardProps) {
  const bandConfig = lake.band ? HEALTH_BAND_CONFIG[lake.band] : null

  return (
    <Link href={`/lake/${lake.slug}`}>
      <div
        className={`
          card p-4 cursor-pointer animate-fade-in
          ${isSelected ? 'ring-2 ring-sky-500' : ''}
          hover:scale-[1.02] transition-transform
        `}
        onClick={onClick}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Lake Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-100 truncate">
              {lake.name}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {lake.lastUpdated
                ? `Updated ${formatTimeAgo(lake.lastUpdated)}`
                : 'No data'}
            </p>

            {bandConfig && (
              <span
                className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  color: bandConfig.color,
                  background: bandConfig.bgColor,
                }}
              >
                {bandConfig.label}
              </span>
            )}
          </div>

          {/* Score */}
          {lake.currentScore !== null && lake.band && (
            <HealthScoreGauge
              score={lake.currentScore}
              band={lake.band}
              size="sm"
              showLabel={false}
            />
          )}
        </div>
      </div>
    </Link>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
