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

export function LakeCard({ lake, isSelected, onClick }: LakeCardProps) {
  const bandConfig = lake.band ? HEALTH_BAND_CONFIG[lake.band] : null

  return (
    <Link href={`/lake/${lake.slug}`}>
      <Card
        className={cn(
          'transition-all hover:shadow-md cursor-pointer h-full border-muted',
          isSelected && 'ring-2 ring-primary'
        )}
        onClick={onClick}
      >
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold text-lg leading-none truncate">
              {lake.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lake.lastUpdated
                ? `Updated ${formatTimeAgo(lake.lastUpdated)}`
                : 'No data'}
            </p>

            {bandConfig && (
              <Badge
                variant="outline"
                className="mt-2"
                style={{
                  color: `hsl(var(--color-${lake.band}))`, // Using CSS variables from globals.css
                  borderColor: `hsl(var(--color-${lake.band}) / 0.3)`,
                  backgroundColor: `hsl(var(--color-${lake.band}) / 0.1)`,
                }}
              >
                {bandConfig.label}
              </Badge>
            )}
          </div>

          {lake.currentScore !== null && lake.band && (
            <HealthScoreGauge
              score={lake.currentScore}
              band={lake.band}
              size="sm"
              showLabel={false}
            />
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
