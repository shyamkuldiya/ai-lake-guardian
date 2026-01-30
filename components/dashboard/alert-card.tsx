'use client'

import type { Alert } from '@/lib/schemas/alert'
import { ALERT_SEVERITY_CONFIG } from '@/lib/schemas/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AlertCardProps {
  alert: Alert
  compact?: boolean
}

import { HugeiconsIcon } from '@hugeicons/react'
import {
  InformationCircleIcon,
  Alert01Icon,
  AlertCircleIcon,
  Clock01Icon,
} from '@hugeicons/core-free-icons'

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const severityConfig = ALERT_SEVERITY_CONFIG[alert.severity]

  // Map icons
  const icons = {
    info: InformationCircleIcon,
    warning: Alert01Icon,
    critical: AlertCircleIcon,
  }
  const Icon = icons[alert.severity]

  let accentColor = ''
  if (alert.severity === 'critical') accentColor = 'text-red-500'
  else if (alert.severity === 'warning') accentColor = 'text-amber-500'
  else accentColor = 'text-blue-500'

  return (
    <Card
      className={cn(
        'relative transition-all duration-200  border-muted/50 overflow-hidden',
        alert.severity === 'critical'
          ? 'bg-red-500/5'
          : alert.severity === 'warning'
            ? 'bg-amber-500/5'
            : 'bg-blue-500/5'
      )}
    >
      {/* Decorative vertical bar */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1',
          alert.severity === 'critical'
            ? 'bg-red-500'
            : alert.severity === 'warning'
              ? 'bg-amber-500'
              : 'bg-blue-500'
        )}
      />

      <CardContent className={compact ? 'p-4' : 'p-5'}>
        <div className="flex items-start gap-4">
          <div
            className={cn('p-2 rounded-lg bg-background border ', accentColor)}
          >
            <HugeiconsIcon icon={Icon} className="size-5" strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-foreground text-sm tracking-tight truncate">
                {alert.lakeName || 'System Alert'}
              </h4>
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider px-1.5 h-5 font-bold"
                style={{
                  color: severityConfig.color,
                  borderColor: `${severityConfig.color}40`,
                  backgroundColor: `${severityConfig.color}10`,
                }}
              >
                {severityConfig.label}
              </Badge>
            </div>

            <p className="text-sm font-semibold text-foreground/90 leading-tight mb-2">
              {alert.title}
            </p>

            {!compact && alert.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed border-l-2 border-muted pl-2 py-1 bg-muted/20 rounded-r">
                {alert.description}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-3 font-medium">
              <HugeiconsIcon icon={Clock01Icon} className="size-3" />
              <span>{formatDistanceToNow(new Date(alert.createdAt))} ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDistanceToNow(date: Date): string {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}
