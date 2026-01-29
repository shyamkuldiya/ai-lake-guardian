'use client'

import { Header } from '@/components/layout'
import { StatsOverview, LakeCard, AlertCard } from '@/components/dashboard'
import { useLakes, useAlerts } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, Download } from 'lucide-react' // If these fail I'll fallback to text

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time monitoring and predictive analytics for Udaipur lakes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isLoading}
            >
              <span className="mr-2">🔄</span> Sync Data
            </Button>
            <Button size="sm">
              <span className="mr-2">📥</span> Download Report
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lakes Section */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Monitored Lakes
              </h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            {isLakesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-muted/20 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lakes?.map((lake) => (
                  <LakeCard key={lake.id} lake={lake} />
                ))}
                {(!lakes || lakes.length === 0) && (
                  <Card className="col-span-full p-12 text-center text-muted-foreground border-dashed">
                    No lakes found in database. Please seed the data.
                  </Card>
                )}
              </div>
            )}
          </section>

          {/* Alerts Section */}
          <section className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Recent Alerts
              </h2>
              <Button variant="ghost" size="sm" className="text-xs">
                View History
              </Button>
            </div>

            {isAlertsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-muted/20 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : alerts && alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} compact />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground border-dashed">
                No active alerts.
              </Card>
            )}
          </section>
        </div>

        {/* AI Insight Banner */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary text-2xl">
                ✨
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-primary">
                  AI Insight
                </h3>
                <p className="text-muted-foreground max-w-3xl">
                  Weather patterns indicate a 85% probability of stable health
                  scores across all Udaipur lakes for the next 48 hours. Overall
                  ecosystem vitality remains High.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
