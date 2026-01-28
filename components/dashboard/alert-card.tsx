'use client'

import type { Alert } from '@/lib/schemas/alert'
import { ALERT_SEVERITY_CONFIG } from '@/lib/schemas/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AlertCardProps {
  alert: Alert
  compact?: boolean
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const severityConfig = ALERT_SEVERITY_CONFIG[alert.severity]

  // Map severity to standard colors if we want, or keep using strict config
  let borderColor = ''
  let bgColor = ''

  if (alert.severity === 'critical') {
    borderColor = 'border-red-500/50'
    bgColor = 'bg-red-500/10'
  } else if (alert.severity === 'warning') {
    borderColor = 'border-amber-500/50'
    bgColor = 'bg-amber-500/10'
  } else {
    borderColor = 'border-blue-500/50'
    bgColor = 'bg-blue-500/10'
  }

  return (
    <Card className={`border-l-4 ${borderColor} ${bgColor}`}>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{severityConfig.icon}</span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground text-sm">
                {alert.lakeName || 'System Alert'}
              </h4>
              <Badge variant="secondary" className="text-xs px-1.5 h-5">
                {severityConfig.label}
              </Badge>
            </div>

            <p className="text-sm font-medium text-foreground">{alert.title}</p>

            {!compact && alert.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {alert.description}
              </p>
            )}

            <p className="text-xs text-muted-foreground mt-2">
              {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
