import { z } from 'zod'

// ============================================
// Prediction Window Enum
// ============================================
export const PredictionWindowEnum = z.enum(['24h', '48h', '72h'])

export type PredictionWindow = z.infer<typeof PredictionWindowEnum>

// ============================================
// Risk Level Enum
// ============================================
export const RiskLevelEnum = z.enum(['low', 'medium', 'high', 'critical'])

export type RiskLevel = z.infer<typeof RiskLevelEnum>

// ============================================
// Prediction Schema
// ============================================
export const PredictionSchema = z.object({
  id: z.string().uuid(),
  lakeId: z.string().uuid(),
  window: PredictionWindowEnum,
  predictedScore: z.number().min(0).max(100),
  currentScore: z.number().min(0).max(100),
  scoreDelta: z.number(),
  riskLevel: RiskLevelEnum,
  confidence: z.number().min(0).max(1),
  causes: z.array(z.string()),
  recommendations: z.array(z.string()),
  explanation: z.string(),
  generatedAt: z.coerce.date(),
  validUntil: z.coerce.date(),
})

export type Prediction = z.infer<typeof PredictionSchema>

// ============================================
// Risk Level Configuration
// ============================================
export const RISK_LEVEL_CONFIG: Record<
  RiskLevel,
  {
    label: string
    color: string
    bgColor: string
    icon: string
  }
> = {
  low: {
    label: 'Low Risk',
    color: '#10B981',
    bgColor: '#10B98120',
    icon: '✓',
  },
  medium: {
    label: 'Medium Risk',
    color: '#F59E0B',
    bgColor: '#F59E0B20',
    icon: '⚠',
  },
  high: {
    label: 'High Risk',
    color: '#F97316',
    bgColor: '#F9731620',
    icon: '⚠',
  },
  critical: {
    label: 'Critical Risk',
    color: '#EF4444',
    bgColor: '#EF444420',
    icon: '🚨',
  },
}

// ============================================
// Prediction Window Labels
// ============================================
export const PREDICTION_WINDOW_LABELS: Record<PredictionWindow, string> = {
  '24h': '24 Hours',
  '48h': '48 Hours',
  '72h': '72 Hours',
}
