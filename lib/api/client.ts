import type { LakeListItem, Lake } from '@/lib/schemas/lake'
import type { HealthScore } from '@/lib/schemas/score'

const API_BASE = '/api'

// ============================================
// API Response Types
// ============================================
interface ApiResponse<T> {
  data: T
  error?: string
}

// ============================================
// Generic Fetch Wrapper
// ============================================
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return response.json()
}

// ============================================
// Lakes API
// ============================================
export const lakesApi = {
  getAll: async (filters?: { band?: string }): Promise<LakeListItem[]> => {
    const params = new URLSearchParams()
    if (filters?.band) params.set('band', filters.band)
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiFetch<LakeListItem[]>(`/lakes${query}`)
  },

  getBySlug: async (slug: string): Promise<Lake> => {
    return apiFetch<Lake>(`/lakes/${slug}`)
  },
}

// ============================================
// Health Scores API
// ============================================
export const scoresApi = {
  getLatest: async (lakeId: string): Promise<HealthScore> => {
    return apiFetch<HealthScore>(`/lakes/${lakeId}/scores/latest`)
  },

  getHistory: async (
    lakeId: string,
    range: '7d' | '30d' | '90d'
  ): Promise<HealthScore[]> => {
    return apiFetch<HealthScore[]>(`/lakes/${lakeId}/scores?range=${range}`)
  },
}

// ============================================
// Predictions API
// ============================================
import type { Prediction, PredictionWindow } from '@/lib/schemas/prediction'

export const predictionsApi = {
  getAll: async (lakeId: string): Promise<Prediction[]> => {
    return apiFetch<Prediction[]>(`/lakes/${lakeId}/predictions`)
  },

  getByWindow: async (
    lakeId: string,
    window: PredictionWindow
  ): Promise<Prediction> => {
    return apiFetch<Prediction>(`/lakes/${lakeId}/predictions/${window}`)
  },
}

// ============================================
// Alerts API
// ============================================
import type { Alert, AlertStatus } from '@/lib/schemas/alert'

export const alertsApi = {
  getAll: async (filters?: {
    lakeId?: string
    status?: AlertStatus
  }): Promise<Alert[]> => {
    const params = new URLSearchParams()
    if (filters?.lakeId) params.set('lakeId', filters.lakeId)
    if (filters?.status) params.set('status', filters.status)
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiFetch<Alert[]>(`/alerts${query}`)
  },

  acknowledge: async (alertId: string): Promise<Alert> => {
    return apiFetch<Alert>(`/alerts/${alertId}/acknowledge`, {
      method: 'POST',
    })
  },

  resolve: async (alertId: string): Promise<Alert> => {
    return apiFetch<Alert>(`/alerts/${alertId}/resolve`, {
      method: 'POST',
    })
  },
}

// ============================================
// Sensors API
// ============================================
import type { SensorReading } from '@/lib/schemas/sensor'

export const sensorsApi = {
  getLatest: async (lakeId: string): Promise<SensorReading[]> => {
    return apiFetch<SensorReading[]>(`/lakes/${lakeId}/sensors`)
  },
}

// ============================================
// Reports API
// ============================================
import type { CitizenReport, ReportFormData } from '@/lib/schemas/report'

export const reportsApi = {
  getAll: async (filters?: {
    lakeId?: string
    status?: string
  }): Promise<CitizenReport[]> => {
    const params = new URLSearchParams()
    if (filters?.lakeId) params.set('lakeId', filters.lakeId)
    if (filters?.status) params.set('status', filters.status)
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiFetch<CitizenReport[]>(`/reports${query}`)
  },

  submit: async (
    data: ReportFormData & { imageUrl: string }
  ): Promise<CitizenReport> => {
    return apiFetch<CitizenReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/reports/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    return response.json()
  },
}
