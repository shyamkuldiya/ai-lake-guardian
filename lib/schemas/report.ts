import { z } from 'zod'
import { CoordinatesSchema } from './lake'

// ============================================
// Report Type Enum
// ============================================
export const ReportTypeEnum = z.enum([
  'plastic_debris',
  'algae_bloom',
  'foam_pollution',
  'dead_fish',
  'sewage_smell',
  'oil_spill',
  'other',
])

export type ReportType = z.infer<typeof ReportTypeEnum>

// ============================================
// Report Status Enum
// ============================================
export const ReportStatusEnum = z.enum([
  'pending',
  'analyzing',
  'verified',
  'rejected',
])

export type ReportStatus = z.infer<typeof ReportStatusEnum>

// ============================================
// Image Analysis Schema
// ============================================
export const ImageAnalysisSchema = z.object({
  detectedIssues: z.array(z.string()),
  severity: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  description: z.string(),
})

export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>

// ============================================
// Citizen Report Schema
// ============================================
export const CitizenReportSchema = z.object({
  id: z.string().uuid(),
  lakeId: z.string().uuid(),
  lakeName: z.string().optional(),
  reportType: ReportTypeEnum,
  description: z.string().max(1000).optional(),
  location: CoordinatesSchema,
  imageUrl: z.string().url(),
  imageAnalysis: ImageAnalysisSchema.optional(),
  status: ReportStatusEnum,
  submittedAt: z.coerce.date(),
  processedAt: z.coerce.date().optional(),
})

export type CitizenReport = z.infer<typeof CitizenReportSchema>

// ============================================
// Report Form Schema (for validation)
// ============================================
export const ReportFormSchema = z.object({
  lakeId: z.string().uuid('Please select a lake'),
  reportType: ReportTypeEnum,
  description: z.string().max(1000).optional(),
  location: CoordinatesSchema,
})

export type ReportFormData = z.infer<typeof ReportFormSchema>

// ============================================
// Report Type Display Info
// ============================================
export const REPORT_TYPE_INFO: Record<
  ReportType,
  {
    label: string
    description: string
    icon: string
  }
> = {
  plastic_debris: {
    label: 'Plastic/Debris',
    description: 'Floating plastic, garbage, or debris',
    icon: '🗑️',
  },
  algae_bloom: {
    label: 'Algae Bloom',
    description: 'Green/blue algae covering water surface',
    icon: '🦠',
  },
  foam_pollution: {
    label: 'Foam/Pollution',
    description: 'Foam, discoloration, or chemical pollution',
    icon: '🧪',
  },
  dead_fish: {
    label: 'Dead Fish/Wildlife',
    description: 'Dead fish or other aquatic life',
    icon: '🐟',
  },
  sewage_smell: {
    label: 'Sewage Smell',
    description: 'Foul smell indicating sewage contamination',
    icon: '💨',
  },
  oil_spill: {
    label: 'Oil Spill',
    description: 'Oil slick or fuel contamination',
    icon: '🛢️',
  },
  other: {
    label: 'Other',
    description: 'Other environmental concern',
    icon: '❓',
  },
}
