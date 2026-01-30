'use client'

import Link from 'next/link'
import type { LakeListItem } from '@/lib/schemas/lake'
import { HEALTH_BAND_CONFIG } from '@/lib/schemas/score'
import { HealthScoreGauge } from './health-score-gauge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface LakeCardProps {
  lake: LakeListItem
  isSelected?: boolean
  onClick?: () => void
}

import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

export function LakeCard({ lake, isSelected, onClick }: LakeCardProps) {
  const bandConfig = lake.band ? HEALTH_BAND_CONFIG[lake.band] : null

  return (
    <Link href={`/lake/${lake.slug}`}>
      <Card
        className={cn(
          'group relative transition-all duration-300  hover:-translate-y-1 cursor-pointer h-full border-muted/50 overflow-hidden',
          isSelected && 'ring-2 ring-primary '
        )}
        onClick={onClick}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <CardContent className="p-6 flex items-center justify-between gap-4 relative">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-1">
              <h3 className="font-bold text-xl leading-tight truncate group-hover:text-primary transition-colors">
                {lake.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                <span>
                  {lake.lastUpdated
                    ? `${formatTimeAgo(lake.lastUpdated)}`
                    : 'No data'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {bandConfig && (
                <Badge
                  variant="outline"
                  className="font-medium text-[10px] uppercase tracking-wider px-2 py-0"
                  style={{
                    color: bandConfig.color,
                    borderColor: bandConfig.color,
                    backgroundColor: `${bandConfig.color}15`,
                  }}
                >
                  {bandConfig.label}
                </Badge>
              )}
              <div className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 hidden sm:block">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 text-primary"
                />
              </div>
            </div>
          </div>

          {lake.currentScore !== null && lake.band && (
            <div className="shrink-0 relative">
              <HealthScoreGauge
                score={lake.currentScore}
                band={lake.band}
                size="sm"
                showLabel={false}
              />
            </div>
          )}
        </CardContent>
      </Card>
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
