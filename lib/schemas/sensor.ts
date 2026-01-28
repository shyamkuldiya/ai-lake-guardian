import { z } from 'zod'

// ============================================
// Sensor Type Enum
// ============================================
export const SensorTypeEnum = z.enum([
  'dissolved_oxygen',
  'turbidity',
  'water_temperature',
  'algae_bloom_index',
  'rainfall_sewage_risk',
  'human_pressure',
])

export type SensorType = z.infer<typeof SensorTypeEnum>

// ============================================
// Sensor Reading Schema
// ============================================
export const SensorReadingSchema = z.object({
  id: z.string().uuid(),
  lakeId: z.string().uuid(),
  sensorType: SensorTypeEnum,
  value: z.number().min(0).max(100),
  rawValue: z.number().optional(),
  unit: z.string().optional(),
  confidence: z.number().min(0).max(1),
  timestamp: z.coerce.date(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type SensorReading = z.infer<typeof SensorReadingSchema>

// ============================================
// Sensor Display Info
// ============================================
export const SENSOR_DISPLAY_INFO: Record<
  SensorType,
  {
    label: string
    description: string
    unit: string
    icon: string
  }
> = {
  dissolved_oxygen: {
    label: 'Dissolved Oxygen',
    description: 'Oxygen levels critical for aquatic life',
    unit: '%',
    icon: '💨',
  },
  turbidity: {
    label: 'Turbidity',
    description: 'Water clarity and sediment levels',
    unit: '%',
    icon: '🌊',
  },
  water_temperature: {
    label: 'Water Temperature',
    description: 'Thermal stress indicator',
    unit: '%',
    icon: '🌡️',
  },
  algae_bloom_index: {
    label: 'Algae Bloom Index',
    description: 'Eutrophication and bloom risk',
    unit: '%',
    icon: '🦠',
  },
  rainfall_sewage_risk: {
    label: 'Rainfall & Sewage Risk',
    description: 'Overflow and contamination risk',
    unit: '%',
    icon: '🌧️',
  },
  human_pressure: {
    label: 'Human Pressure',
    description: 'Tourist and activity impact',
    unit: '%',
    icon: '👥',
  },
}
