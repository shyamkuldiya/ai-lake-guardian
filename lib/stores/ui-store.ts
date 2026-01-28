import { create } from 'zustand'
import type { HealthBand } from '@/lib/schemas/score'
import type { PredictionWindow } from '@/lib/schemas/prediction'

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Map
  selectedLakeId: string | null
  setSelectedLake: (id: string | null) => void
  mapZoom: number
  setMapZoom: (zoom: number) => void
  mapCenter: { lat: number; lng: number }
  setMapCenter: (center: { lat: number; lng: number }) => void

  // Time Range for charts
  timeRange: '7d' | '30d' | '90d'
  setTimeRange: (range: '7d' | '30d' | '90d') => void

  // Prediction Window
  predictionWindow: PredictionWindow
  setPredictionWindow: (window: PredictionWindow) => void

  // Mobile menu
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

// Default map center: Udaipur, India
const UDAIPUR_CENTER = { lat: 24.5854, lng: 73.7125 }

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Map
  selectedLakeId: null,
  setSelectedLake: (id) => set({ selectedLakeId: id }),
  mapZoom: 12,
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  mapCenter: UDAIPUR_CENTER,
  setMapCenter: (center) => set({ mapCenter: center }),

  // Time Range
  timeRange: '7d',
  setTimeRange: (range) => set({ timeRange: range }),

  // Prediction Window
  predictionWindow: '24h',
  setPredictionWindow: (window) => set({ predictionWindow: window }),

  // Mobile menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}))
