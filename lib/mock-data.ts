import type { LakeListItem, Lake } from '@/lib/schemas/lake'
import type { HealthScore, ScoreComponents } from '@/lib/schemas/score'
import type { SensorReading, SensorType } from '@/lib/schemas/sensor'
import type { Prediction, PredictionWindow } from '@/lib/schemas/prediction'
import type { Alert } from '@/lib/schemas/alert'

// ============================================
// Mock Lakes Data (Udaipur)
// ============================================
export const MOCK_LAKES: LakeListItem[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Pichola Lake',
    slug: 'pichola',
    location: { latitude: 24.5764, longitude: 73.6827 },
    currentScore: 85,
    band: 'healthy',
    lastUpdated: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Fateh Sagar Lake',
    slug: 'fateh-sagar',
    location: { latitude: 24.6006, longitude: 73.6784 },
    currentScore: 67,
    band: 'at_risk',
    lastUpdated: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Udai Sagar Lake',
    slug: 'udai-sagar',
    location: { latitude: 24.5478, longitude: 73.7845 },
    currentScore: 78,
    band: 'healthy',
    lastUpdated: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Jaisamand Lake',
    slug: 'jaisamand',
    location: { latitude: 24.2167, longitude: 73.9333 },
    currentScore: 82,
    band: 'healthy',
    lastUpdated: new Date(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Badi Lake',
    slug: 'badi',
    location: { latitude: 24.6328, longitude: 73.6428 },
    currentScore: 45,
    band: 'degrading',
    lastUpdated: new Date(),
  },
]

// ============================================
// Mock Lake Details
// ============================================
export const MOCK_LAKE_DETAILS: Record<string, Lake> = {
  pichola: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Pichola Lake',
    slug: 'pichola',
    description:
      'Pichola Lake is an artificial fresh water lake, created in 1362 AD. It is one of the most famous lakes in Udaipur, known for the Lake Palace.',
    location: { latitude: 24.5764, longitude: 73.6827 },
    areaSquareKm: 6.96,
    maxDepthMeters: 8.5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
}

// ============================================
// Mock Health Scores
// ============================================
export function generateMockScoreComponents(): ScoreComponents {
  return {
    dissolvedOxygen: Math.floor(Math.random() * 20) + 80, // 80-100
    turbidity: Math.floor(Math.random() * 30) + 65, // 65-95
    waterTemperature: Math.floor(Math.random() * 20) + 75, // 75-95
    algaeBloomIndex: Math.floor(Math.random() * 25) + 70, // 70-95
    rainfallSewageRisk: Math.floor(Math.random() * 30) + 60, // 60-90
    humanPressure: Math.floor(Math.random() * 20) + 75, // 75-95
  }
}

export function generateMockHealthScore(
  lakeId: string,
  daysAgo: number = 0
): HealthScore {
  const components = generateMockScoreComponents()
  const score = Math.round(
    components.dissolvedOxygen * 0.25 +
      components.turbidity * 0.2 +
      components.waterTemperature * 0.15 +
      components.algaeBloomIndex * 0.15 +
      components.rainfallSewageRisk * 0.15 +
      components.humanPressure * 0.1
  )

  const band =
    score >= 80
      ? 'healthy'
      : score >= 60
        ? 'at_risk'
        : score >= 40
          ? 'degrading'
          : 'critical'

  const timestamp = new Date()
  timestamp.setDate(timestamp.getDate() - daysAgo)

  return {
    id: crypto.randomUUID(),
    lakeId,
    score,
    band,
    components,
    confidence: 0.85 + Math.random() * 0.1,
    timestamp,
  }
}

export function generateMockScoreHistory(
  lakeId: string,
  days: number = 7
): HealthScore[] {
  return Array.from({ length: days * 24 }, (_, i) =>
    generateMockHealthScore(lakeId, i / 24)
  ).reverse()
}

// ============================================
// Mock Sensor Readings
// ============================================
export function generateMockSensorReadings(lakeId: string): SensorReading[] {
  const sensorTypes: SensorType[] = [
    'dissolved_oxygen',
    'turbidity',
    'water_temperature',
    'algae_bloom_index',
    'rainfall_sewage_risk',
    'human_pressure',
  ]

  return sensorTypes.map((sensorType) => ({
    id: crypto.randomUUID(),
    lakeId,
    sensorType,
    value: Math.floor(Math.random() * 30) + 70, // 70-100
    confidence: 0.8 + Math.random() * 0.15,
    timestamp: new Date(),
  }))
}

// ============================================
// Mock Predictions
// ============================================
export function generateMockPredictions(
  lakeId: string,
  currentScore: number
): Prediction[] {
  const windows: PredictionWindow[] = ['24h', '48h', '72h']

  return windows.map((window, index) => {
    const delta = Math.floor(Math.random() * 8) - 4 // -4 to +4
    const predictedScore = Math.max(0, Math.min(100, currentScore + delta))
    const riskLevel =
      delta < -5 ? 'high' : delta < -2 ? 'medium' : delta < 2 ? 'low' : 'low'

    return {
      id: crypto.randomUUID(),
      lakeId,
      window,
      predictedScore,
      currentScore,
      scoreDelta: delta,
      riskLevel,
      confidence: 0.9 - index * 0.1,
      causes:
        delta < 0
          ? [
              'Expected rainfall may increase runoff',
              'Weekend tourist surge anticipated',
            ]
          : ['Weather conditions favorable', 'Reduced human activity expected'],
      recommendations:
        delta < 0
          ? [
              'Increase patrol near boat ghats',
              'Pre-position waste collection teams',
            ]
          : [
              'Maintain current monitoring levels',
              'Continue routine inspections',
            ],
      explanation:
        delta < 0
          ? `Health score is expected to ${delta < -3 ? 'decline significantly' : 'decrease slightly'} due to environmental factors.`
          : 'Conditions are expected to remain stable or improve.',
      generatedAt: new Date(),
      validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000),
    }
  })
}

// ============================================
// Mock Alerts
// ============================================
export const MOCK_ALERTS: Alert[] = [
  {
    id: crypto.randomUUID(),
    lakeId: '550e8400-e29b-41d4-a716-446655440002',
    lakeName: 'Fateh Sagar Lake',
    severity: 'warning',
    status: 'active',
    title: 'High rainfall risk in 24 hours',
    description:
      'Weather forecast indicates heavy rainfall which may cause sewage overflow and increased turbidity.',
    cause: 'Monsoon weather pattern approaching',
    recommendation:
      'Prepare drainage systems and increase monitoring frequency',
    triggeredBy: 'prediction_engine',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: crypto.randomUUID(),
    lakeId: '550e8400-e29b-41d4-a716-446655440001',
    lakeName: 'Pichola Lake',
    severity: 'info',
    status: 'active',
    title: 'Tourist surge expected this weekend',
    description:
      'Local festival and weekend combination expected to increase visitor count by 40%.',
    cause: 'Upcoming cultural event and weekend',
    recommendation: 'Deploy additional waste management resources',
    triggeredBy: 'event_calendar',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: crypto.randomUUID(),
    lakeId: '550e8400-e29b-41d4-a716-446655440005',
    lakeName: 'Badi Lake',
    severity: 'critical',
    status: 'active',
    title: 'Algae bloom detected',
    description:
      'Satellite imagery shows potential algae bloom formation in the northern section of the lake.',
    cause: 'Rising water temperature and nutrient levels',
    recommendation:
      'Deploy aeration systems and collect water samples for analysis',
    triggeredBy: 'satellite_analysis',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
]
