import { z } from 'zod'

// ============================================
// Health Band Enum
// ============================================
export const HealthBandEnum = z.enum([
  'healthy', // 80-100
  'at_risk', // 60-79
  'degrading', // 40-59
  'critical', // 0-39
])

export type HealthBand = z.infer<typeof HealthBandEnum>

// ============================================
// Score Components Schema
// ============================================
export const ScoreComponentsSchema = z.object({
  dissolvedOxygen: z.number().min(0).max(100),
  turbidity: z.number().min(0).max(100),
  waterTemperature: z.number().min(0).max(100),
  algaeBloomIndex: z.number().min(0).max(100),
  rainfallSewageRisk: z.number().min(0).max(100),
  humanPressure: z.number().min(0).max(100),
})

export type ScoreComponents = z.infer<typeof ScoreComponentsSchema>

// ============================================
// Health Score Schema
// ============================================
export const HealthScoreSchema = z.object({
  id: z.string().uuid(),
  lakeId: z.string().uuid(),
  score: z.number().min(0).max(100),
  band: HealthBandEnum,
  components: ScoreComponentsSchema,
  confidence: z.number().min(0).max(1),
  timestamp: z.coerce.date(),
})

export type HealthScore = z.infer<typeof HealthScoreSchema>

// ============================================
// Health Band Utilities
// ============================================
export function getHealthBand(score: number): HealthBand {
  if (score >= 80) return 'healthy'
  if (score >= 60) return 'at_risk'
  if (score >= 40) return 'degrading'
  return 'critical'
}

export const HEALTH_BAND_CONFIG: Record<
  HealthBand,
  {
    label: string
    color: string
    bgColor: string
    description: string
  }
> = {
  healthy: {
    label: 'Healthy',
    color: '#10B981',
    bgColor: '#10B98120',
    description: 'Lake is in excellent condition',
  },
  at_risk: {
    label: 'At Risk',
    color: '#F59E0B',
    bgColor: '#F59E0B20',
    description: 'Some indicators show concern',
  },
  degrading: {
    label: 'Degrading',
    color: '#F97316',
    bgColor: '#F9731620',
    description: 'Multiple indicators declining',
  },
  critical: {
    label: 'Critical',
    color: '#EF4444',
    bgColor: '#EF444420',
    description: 'Immediate attention required',
  },
}

// ============================================
// Score Weights (from PRD)
// ============================================
export const SCORE_WEIGHTS = {
  dissolvedOxygen: 0.25,
  turbidity: 0.2,
  waterTemperature: 0.15,
  algaeBloomIndex: 0.15,
  rainfallSewageRisk: 0.15,
  humanPressure: 0.1,
} as const

export function calculateHealthScore(components: ScoreComponents): number {
  return Math.round(
    components.dissolvedOxygen * SCORE_WEIGHTS.dissolvedOxygen +
      components.turbidity * SCORE_WEIGHTS.turbidity +
      components.waterTemperature * SCORE_WEIGHTS.waterTemperature +
      components.algaeBloomIndex * SCORE_WEIGHTS.algaeBloomIndex +
      components.rainfallSewageRisk * SCORE_WEIGHTS.rainfallSewageRisk +
      components.humanPressure * SCORE_WEIGHTS.humanPressure
  )
}
