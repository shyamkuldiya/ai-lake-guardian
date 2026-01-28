import { NextResponse } from 'next/server'
import { MOCK_ALERTS } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lakeId = searchParams.get('lakeId')
  const status = searchParams.get('status')

  let alerts = [...MOCK_ALERTS]

  // Filter by lakeId if provided
  if (lakeId) {
    alerts = alerts.filter((a) => a.lakeId === lakeId)
  }

  // Filter by status if provided
  if (status) {
    alerts = alerts.filter((a) => a.status === status)
  }

  // Sort by severity (critical first) then by date
  alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
    if (severityDiff !== 0) return severityDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return NextResponse.json(alerts)
}
