import { z } from 'zod'

// ============================================
// Coordinates Schema
// ============================================
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export type Coordinates = z.infer<typeof CoordinatesSchema>

// ============================================
// Lake Boundary Schema
// ============================================
export const LakeBoundarySchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
})

export type LakeBoundary = z.infer<typeof LakeBoundarySchema>

// ============================================
// Lake Schema
// ============================================
export const LakeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  location: CoordinatesSchema,
  boundary: LakeBoundarySchema.optional(),
  areaSquareKm: z.number().positive(),
  maxDepthMeters: z.number().positive().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Lake = z.infer<typeof LakeSchema>

// ============================================
// Lake List Item (for dashboard)
// ============================================
export const LakeListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  location: CoordinatesSchema,
  currentScore: z.number().min(0).max(100).nullable(),
  band: z.enum(['healthy', 'at_risk', 'degrading', 'critical']).nullable(),
  lastUpdated: z.coerce.date().nullable(),
})

export type LakeListItem = z.infer<typeof LakeListItemSchema>
