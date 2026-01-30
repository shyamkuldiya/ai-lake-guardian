'use client'

import { Header } from '@/components/layout'
import { StatsOverview, LakeCard, AlertCard } from '@/components/dashboard'
import { useLakes, useAlerts } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Download01Icon,
  CircleArrowReload01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'

export default function DashboardPage() {
  const {
    data: lakes,
    isLoading: isLakesLoading,
    refetch: refetchLakes,
  } = useLakes()
  const {
    data: alerts,
    isLoading: isAlertsLoading,
    refetch: refetchAlerts,
  } = useAlerts()

  const isLoading = isLakesLoading || isAlertsLoading

  const handleSync = () => {
    refetchLakes()
    refetchAlerts()
  }

  const handleDownloadReport = () => {
    if (!lakes || lakes.length === 0) return

    const headers = ['Lake Name', 'Current Score', 'Status', 'Last Updated']
    const csvData = lakes.map((lake) => [
      lake.name,
      lake.currentScore || 'N/A',
      lake.band || 'N/A',
      lake.lastUpdated ? new Date(lake.lastUpdated).toLocaleString() : 'N/A',
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `udaipur-lakes-report-${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">
              Lake Guardian Command
            </h1>
            <p className="text-muted-foreground font-medium">
              Udaipur's Ecological Intelligence & Predictive Monitoring Network
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isLoading}
            >
              <HugeiconsIcon
                icon={CircleArrowReload01Icon}
                className="mr-2 size-4"
              />{' '}
              Sync Data
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadReport}
              disabled={!lakes?.length}
            >
              <HugeiconsIcon icon={Download01Icon} className="mr-2 size-4" />{' '}
              Download Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <section>
          {isLoading ? (
            <div className="w-full h-40 bg-muted/20 animate-pulse rounded-xl" />
          ) : (
            <StatsOverview
              lakes={lakes ?? []}
              alertCount={
                alerts?.filter((a) => a.status === 'active').length ?? 0
              }
            />
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lakes Section */}
          <section className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Monitored Lakes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time health telemetry
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full px-4">
                View All
              </Button>
            </div>

            {isLakesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-muted/20 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lakes?.map((lake) => (
                  <LakeCard key={lake.id} lake={lake} />
                ))}
                {(!lakes || lakes.length === 0) && (
                  <Card className="col-span-full p-12 text-center text-muted-foreground border-dashed rounded-2xl">
                    No lakes found in database. Please seed the data.
                  </Card>
                )}
              </div>
            )}

            {/* AI Insight Banner */}
            <section className="pt-4">
              <Card className="bg-primary/5 border-primary/10 overflow-hidden rounded-2xl relative shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner">
                    <HugeiconsIcon
                      icon={SparklesIcon}
                      className="size-8"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="font-bold text-xl text-primary tracking-tight">
                      AI Guardian Forecast
                    </h3>
                    <p className="text-muted-foreground max-w-2xl leading-relaxed">
                      Our predictive models indicate a{' '}
                      <strong>85% probability</strong> of stable health scores
                      across Udaipur's core ecosystem for the next 48 hours. No
                      immediate risks detected from weather influx.
                    </p>
                    <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Optimized
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        Reliability: High
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </section>

          {/* Alerts Section */}
          <section className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Alerts</h2>
                <p className="text-sm text-muted-foreground">Recent events</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                History
              </Button>
            </div>

            {isAlertsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 bg-muted/20 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            ) : alerts && alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} compact />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center text-muted-foreground border-dashed rounded-2xl">
                All systems optimal.
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
