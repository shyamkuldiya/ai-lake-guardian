'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout'
import { HealthScoreGauge } from '@/components/dashboard'
import {
  TrendChart,
  SensorCards,
  PredictionPanel,
  AIAnalysisPanel,
} from '@/components/lake-detail'
import {
  useLake,
  useLatestScore,
  useScoreHistory,
  useLatestSensors,
  usePredictions,
} from '@/lib/hooks'

export default function LakeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  // Fetch all data for the lake
  const { data: lake, isLoading: isLakeLoading, error } = useLake(slug)
  const { data: currentScore, isLoading: isScoreLoading } = useLatestScore(
    lake?.id ?? ''
  )
  const { data: history, isLoading: isHistoryLoading } = useScoreHistory(
    lake?.id ?? '',
    timeRange
  )
  const { data: sensors, isLoading: isSensorsLoading } = useLatestSensors(
    lake?.id ?? ''
  )
  const { data: predictions, isLoading: isPredictionsLoading } = usePredictions(
    lake?.id ?? ''
  )

  if (error) {
    notFound()
  }

  // Combine loading state for critical "above the fold" content
  const isCriticalLoading = isLakeLoading || isScoreLoading

  if (!isCriticalLoading && !lake) {
    notFound()
  }

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
                {lake?.name}
              </h1>
              <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">
                {lake?.areaSquareKm} km²
              </span>
            </div>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              {lake?.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            {isCriticalLoading ? (
              <div className="w-32 h-32 rounded-full bg-slate-700/50 animate-pulse" />
            ) : (
              currentScore && (
                <HealthScoreGauge
                  score={currentScore.score}
                  band={currentScore.band}
                  size="md"
                />
              )
            )}
            <div className="hidden sm:block">
              <div className="text-sm text-slate-400">Current Status</div>
              <div className="text-2xl font-bold text-slate-100">
                {currentScore?.score ? `${currentScore.score}/100` : '--'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Updated just now
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <section className="animate-fade-in stagger-1">
          <AIAnalysisPanel
            score={currentScore?.score ?? 0}
            band={currentScore?.band ?? 'healthy'}
            lakeName={lake?.name ?? 'Lake'}
            isLoading={isScoreLoading}
          />
        </section>

        {/* Virtual Sensors */}
        <section className="animate-fade-in stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <span>🔬</span> Virtual Sensor Readings
            </h2>
            <span className="text-xs text-slate-400">Real-time estimates</span>
          </div>
          <SensorCards sensors={sensors ?? []} isLoading={isSensorsLoading} />
        </section>

        {/* Health Trend */}
        <section className="animate-fade-in stagger-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <span>📈</span> Health Trend
            </h2>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`
                                px-3 py-1 rounded text-xs font-medium transition-colors
                                ${
                                  timeRange === range
                                    ? 'bg-sky-500 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }
                            `}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-6 h-[350px]">
            {isHistoryLoading ? (
              <div className="w-full h-full bg-slate-800/50 animate-pulse rounded-lg" />
            ) : (
              <TrendChart data={history ?? []} range={timeRange} />
            )}
          </div>
        </section>

        {/* Predictions */}
        <section className="animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <span>🔮</span> Future Predictions
            </h2>
            <span className="text-xs text-slate-400">AI Forecast</span>
          </div>
          <PredictionPanel
            predictions={predictions ?? []}
            isLoading={isPredictionsLoading}
          />
        </section>
      </main>
    </div>
  )
}
