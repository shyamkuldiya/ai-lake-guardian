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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function LakeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

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

  if (error) notFound()
  if (!isLakeLoading && !isScoreLoading && !lake) notFound()

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {lake?.name}
                </h1>
                {lake?.areaSquareKm && (
                  <Badge variant="secondary" className="text-sm">
                    {lake.areaSquareKm} km²
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {lake?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 rounded-2xl bg-muted/30 border">
            {isScoreLoading || !currentScore ? (
              <div className="w-32 h-32 rounded-full bg-muted/50 animate-pulse" />
            ) : (
              <HealthScoreGauge
                score={currentScore.score}
                band={currentScore.band}
                size="md"
              />
            )}
            <div className="hidden sm:block space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Current Status
              </div>
              <div className="text-3xl font-bold tracking-tighter">
                {currentScore?.score ? `${currentScore.score}/100` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">
                Updated just now
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* AI Analysis */}
        <section className="space-y-4">
          <AIAnalysisPanel
            score={currentScore?.score ?? 0}
            band={currentScore?.band ?? 'healthy'}
            lakeName={lake?.name ?? 'Lake'}
            isLoading={isScoreLoading}
          />
        </section>

        {/* Virtual Sensors */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Virtual Sensor Readings
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time estimations from satellite and IoT data.
              </p>
            </div>
          </div>
          <SensorCards sensors={sensors ?? []} isLoading={isSensorsLoading} />
        </section>

        {/* Health Trend */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Health Trend
              </h2>
              <p className="text-sm text-muted-foreground">
                Historical performance analysis.
              </p>
            </div>
            <div className="flex items-center p-1 bg-muted rounded-lg">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="h-8 text-xs font-medium"
                >
                  {range.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 h-[400px]">
            {isHistoryLoading ? (
              <div className="w-full h-full bg-muted/20 animate-pulse rounded" />
            ) : (
              <TrendChart data={history ?? []} range={timeRange} />
            )}
          </div>
        </section>

        {/* Predictions */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Future Predictions
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-forecasted ecological changes.
            </p>
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
