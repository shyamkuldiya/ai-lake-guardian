import { useQuery } from '@tanstack/react-query'
import { predictionsApi } from '@/lib/api/client'
import type { PredictionWindow } from '@/lib/schemas/prediction'

// ============================================
// Query Keys
// ============================================
export const predictionKeys = {
  all: ['predictions'] as const,
  lake: (lakeId: string) => [...predictionKeys.all, lakeId] as const,
  predictionWindow: (lakeId: string, window: PredictionWindow) =>
    [...predictionKeys.lake(lakeId), window] as const,
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch all predictions for a lake (24h, 48h, 72h)
 */
export function usePredictions(lakeId: string) {
  return useQuery({
    queryKey: predictionKeys.lake(lakeId),
    queryFn: () => predictionsApi.getAll(lakeId),
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: !!lakeId,
  })
}

/**
 * Fetch a specific prediction window for a lake
 */
export function usePrediction(lakeId: string, window: PredictionWindow) {
  return useQuery({
    queryKey: predictionKeys.predictionWindow(lakeId, window),
    queryFn: () => predictionsApi.getByWindow(lakeId, window),
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: !!lakeId && !!window,
  })
}
