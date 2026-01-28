'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout'
import { StatsOverview, LakeCard, AlertCard } from '@/components/dashboard'
import { MOCK_LAKES, MOCK_ALERTS } from '@/lib/mock-data'
import type { LakeListItem } from '@/lib/schemas/lake'
import type { Alert } from '@/lib/schemas/alert'

export default function DashboardPage() {
  const [lakes, setLakes] = useState<LakeListItem[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setLakes(MOCK_LAKES)
      setAlerts(MOCK_ALERTS)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
            Lake Health Dashboard
          </h1>
          <p className="text-slate-400">
            AI-powered monitoring and prediction for Udaipur&apos;s lakes
          </p>
        </div>

        {/* Stats Overview */}
        <section className="mb-8">
          {isLoading ? (
            <div className="card p-4 animate-pulse">
              <div className="h-20 bg-slate-700/50 rounded" />
            </div>
          ) : (
            <StatsOverview
              lakes={lakes}
              alertCount={alerts.filter((a) => a.status === 'active').length}
            />
          )}
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lakes Section */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <span>🏞️</span>
                Monitored Lakes
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="h-24 bg-slate-700/50 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lakes.map((lake, index) => (
                  <div key={lake.id} className={`stagger-${(index % 5) + 1}`}>
                    <LakeCard lake={lake} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Alerts Section */}
          <section className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <span>🚨</span>
                Active Alerts
              </h2>
              <span className="text-sm text-slate-400">
                {alerts.filter((a) => a.status === 'active').length} active
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="h-20 bg-slate-700/50 rounded" />
                  </div>
                ))}
              </div>
            ) : alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={alert.id} className={`stagger-${(index % 5) + 1}`}>
                    <AlertCard alert={alert} compact />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <span className="text-4xl mb-4 block">✓</span>
                <p className="text-slate-400">No active alerts</p>
                <p className="text-sm text-slate-500 mt-1">
                  All lakes are operating normally
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Info Banner */}
        <section className="mt-8">
          <div className="glass rounded-2xl p-6 border border-sky-500/20">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🤖</span>
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">
                  AI-Powered Predictions
                </h3>
                <p className="text-slate-400 text-sm">
                  Our AI analyzes weather patterns, satellite imagery, and
                  historical data to predict lake health 24-72 hours in advance.
                  Click on any lake to see detailed predictions and recommended
                  actions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
