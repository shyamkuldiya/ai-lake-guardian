import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsApi } from '@/lib/api/client'
import type { ReportFormData } from '@/lib/schemas/report'

// ============================================
// Query Keys
// ============================================
export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters?: { lakeId?: string; status?: string }) =>
    [...reportKeys.lists(), filters] as const,
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch all citizen reports with optional filtering
 */
export function useReports(filters?: { lakeId?: string; status?: string }) {
  return useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: () => reportsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Submit a new citizen report
 */
export function useSubmitReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReportFormData & { imageUrl: string }) =>
      reportsApi.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

/**
 * Upload an image for a report
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => reportsApi.uploadImage(file),
  })
}
