import { useQuery } from '@tanstack/react-query'
import { lakesApi } from '@/lib/api/client'
import type { HealthBand } from '@/lib/schemas/score'

// ============================================
// Query Keys
// ============================================
export const lakeKeys = {
  all: ['lakes'] as const,
  lists: () => [...lakeKeys.all, 'list'] as const,
  list: (filters?: { band?: HealthBand }) =>
    [...lakeKeys.lists(), filters] as const,
  details: () => [...lakeKeys.all, 'detail'] as const,
  detail: (slug: string) => [...lakeKeys.details(), slug] as const,
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch all lakes with optional filtering
 */
export function useLakes(filters?: { band?: HealthBand }) {
  return useQuery({
    queryKey: lakeKeys.list(filters),
    queryFn: () => lakesApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Fetch a single lake by slug
 */
export function useLake(slug: string) {
  return useQuery({
    queryKey: lakeKeys.detail(slug),
    queryFn: () => lakesApi.getBySlug(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug,
  })
}
