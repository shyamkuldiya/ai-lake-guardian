import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '@/lib/api/client'
import type { AlertStatus } from '@/lib/schemas/alert'

// ============================================
// Query Keys
// ============================================
export const alertKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: (filters?: { lakeId?: string; status?: AlertStatus }) =>
    [...alertKeys.lists(), filters] as const,
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch all alerts with optional filtering
 */
export function useAlerts(filters?: { lakeId?: string; status?: AlertStatus }) {
  return useQuery({
    queryKey: alertKeys.list(filters),
    queryFn: () => alertsApi.getAll(filters),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes for real-time alerts
  })
}

/**
 * Acknowledge an alert
 */
export function useAcknowledgeAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (alertId: string) => alertsApi.acknowledge(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all })
    },
  })
}

/**
 * Resolve an alert
 */
export function useResolveAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (alertId: string) => alertsApi.resolve(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all })
    },
  })
}
