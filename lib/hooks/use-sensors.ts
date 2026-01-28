import { useQuery } from '@tanstack/react-query'
import { sensorsApi } from '@/lib/api/client'

// ============================================
// Query Keys
// ============================================
export const sensorKeys = {
  all: ['sensors'] as const,
  lake: (lakeId: string) => [...sensorKeys.all, lakeId] as const,
  latest: (lakeId: string) => [...sensorKeys.lake(lakeId), 'latest'] as const,
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch the latest sensor readings for a lake
 */
export function useLatestSensors(lakeId: string) {
  return useQuery({
    queryKey: sensorKeys.latest(lakeId),
    queryFn: () => sensorsApi.getLatest(lakeId),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    enabled: !!lakeId,
  })
}
