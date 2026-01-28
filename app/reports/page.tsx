'use client'

import { Header } from '@/components/layout'
import { ReportForm } from '@/components/reports'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Citizen Reporting
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Help us protect Udaipur's lakes by reporting pollution, algae
            blooms, or illegal activities. Your eyes on the ground make a
            difference.
          </p>
        </div>

        <ReportForm />
      </main>
    </div>
  )
}
