import { z } from 'zod'

// ============================================
// Alert Severity Enum
// ============================================
export const AlertSeverityEnum = z.enum(['info', 'warning', 'critical'])

export type AlertSeverity = z.infer<typeof AlertSeverityEnum>

// ============================================
// Alert Status Enum
// ============================================
export const AlertStatusEnum = z.enum(['active', 'acknowledged', 'resolved'])

export type AlertStatus = z.infer<typeof AlertStatusEnum>

// ============================================
// Alert Schema
// ============================================
export const AlertSchema = z.object({
  id: z.string().uuid(),
  lakeId: z.string().uuid(),
  lakeName: z.string().optional(),
  severity: AlertSeverityEnum,
  status: AlertStatusEnum,
  title: z.string().max(200),
  description: z.string(),
  cause: z.string().optional(),
  recommendation: z.string().optional(),
  triggeredBy: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.coerce.date(),
  acknowledgedAt: z.coerce.date().optional(),
  resolvedAt: z.coerce.date().optional(),
})

export type Alert = z.infer<typeof AlertSchema>

// ============================================
// Alert Severity Configuration
// ============================================
export const ALERT_SEVERITY_CONFIG: Record<
  AlertSeverity,
  {
    label: string
    color: string
    bgColor: string
    icon: string
  }
> = {
  info: {
    label: 'Info',
    color: '#3B82F6',
    bgColor: '#3B82F620',
    icon: 'ℹ️',
  },
  warning: {
    label: 'Warning',
    color: '#F59E0B',
    bgColor: '#F59E0B20',
    icon: '⚠️',
  },
  critical: {
    label: 'Critical',
    color: '#EF4444',
    bgColor: '#EF444420',
    icon: '🚨',
  },
}
