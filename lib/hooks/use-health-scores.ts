import { useQuery } from '@tanstack/react-query'
import { scoresApi } from '@/lib/api/client'

// ============================================
// Query Keys
// ============================================
export const scoreKeys = {
  all: ['scores'] as const,
  lake: (lakeId: string) => [...scoreKeys.all, lakeId] as const,
  latest: (lakeId: string) => [...scoreKeys.lake(lakeId), 'latest'] as const,
  history: (lakeId: string, range: string) =>
    [...scoreKeys.lake(lakeId), 'history', range] as const,
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch the latest health score for a lake
 */
export function useLatestScore(lakeId: string) {
  return useQuery({
    queryKey: scoreKeys.latest(lakeId),
    queryFn: () => scoresApi.getLatest(lakeId),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    enabled: !!lakeId,
  })
}

/**
 * Fetch health score history for a lake
 */
export function useScoreHistory(
  lakeId: string,
  range: '7d' | '30d' | '90d' = '7d'
) {
  return useQuery({
    queryKey: scoreKeys.history(lakeId, range),
    queryFn: () => scoresApi.getHistory(lakeId, range),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!lakeId,
  })
}
