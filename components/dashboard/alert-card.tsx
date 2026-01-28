'use client'

import type { Alert } from '@/lib/schemas/alert'
import { ALERT_SEVERITY_CONFIG } from '@/lib/schemas/alert'

interface AlertCardProps {
  alert: Alert
  compact?: boolean
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const severityConfig = ALERT_SEVERITY_CONFIG[alert.severity]

  return (
    <div
      className={`
        rounded-lg border animate-slide-in-right
        ${compact ? 'p-3' : 'p-4'}
      `}
      style={{
        borderColor: `${severityConfig.color}40`,
        background: severityConfig.bgColor,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-lg shrink-0">{severityConfig.icon}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className="font-medium truncate"
              style={{ color: severityConfig.color }}
            >
              {alert.lakeName || 'Lake'}
            </h4>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-medium"
              style={{
                color: severityConfig.color,
                background: `${severityConfig.color}20`,
              }}
            >
              {severityConfig.label}
            </span>
          </div>

          <p className="text-sm text-slate-300 mt-1 line-clamp-2">
            {alert.title}
          </p>

          {!compact && alert.description && (
            <p className="text-sm text-slate-400 mt-2 line-clamp-2">
              {alert.description}
            </p>
          )}

          <p className="text-xs text-slate-500 mt-2">
            {formatTimeAgo(alert.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} days ago`
}
