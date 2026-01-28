'use client'

import Link from 'next/link'
import { Header } from '@/components/layout'
import { ReportForm } from '@/components/reports'

export default function ReportsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Citizen Reporting
          </h1>
          <p className="text-slate-400">
            Help us protect Udaipur&apos;s lakes by reporting pollution, algae
            blooms, or illegal activities.
          </p>
        </div>

        <div className="card p-6 md:p-8 animate-fade-in stagger-1">
          <ReportForm />
        </div>
      </main>
    </div>
  )
}
