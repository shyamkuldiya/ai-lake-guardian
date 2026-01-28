import { create } from 'zustand'
import type { HealthBand } from '@/lib/schemas/score'
import type { AlertSeverity } from '@/lib/schemas/alert'

interface FilterState {
  // Health band filter
  healthBandFilter: HealthBand[]
  setHealthBandFilter: (bands: HealthBand[]) => void
  toggleHealthBandFilter: (band: HealthBand) => void

  // Alert severity filter
  alertSeverityFilter: AlertSeverity[]
  setAlertSeverityFilter: (severities: AlertSeverity[]) => void
  toggleAlertSeverityFilter: (severity: AlertSeverity) => void

  // Date range
  dateRange: { start: Date; end: Date } | null
  setDateRange: (range: { start: Date; end: Date } | null) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Reset
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  // Health band filter
  healthBandFilter: [],
  setHealthBandFilter: (bands) => set({ healthBandFilter: bands }),
  toggleHealthBandFilter: (band) =>
    set((state) => ({
      healthBandFilter: state.healthBandFilter.includes(band)
        ? state.healthBandFilter.filter((b) => b !== band)
        : [...state.healthBandFilter, band],
    })),

  // Alert severity filter
  alertSeverityFilter: [],
  setAlertSeverityFilter: (severities) =>
    set({ alertSeverityFilter: severities }),
  toggleAlertSeverityFilter: (severity) =>
    set((state) => ({
      alertSeverityFilter: state.alertSeverityFilter.includes(severity)
        ? state.alertSeverityFilter.filter((s) => s !== severity)
        : [...state.alertSeverityFilter, severity],
    })),

  // Date range
  dateRange: null,
  setDateRange: (range) => set({ dateRange: range }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Reset
  resetFilters: () =>
    set({
      healthBandFilter: [],
      alertSeverityFilter: [],
      dateRange: null,
      searchQuery: '',
    }),
}))
