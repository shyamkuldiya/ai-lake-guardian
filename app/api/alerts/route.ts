import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lakeId = searchParams.get('lakeId')
  const status = searchParams.get('status')

  const supabase = await createClient()

  let query = supabase.from('alerts').select('*, lakes(name)') // Join to get lake name if needed

  if (lakeId) {
    query = query.eq('lake_id', lakeId)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data: alerts, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Map database fields and lake names
  const processed = (alerts || []).map((a) => ({
    id: a.id,
    lakeId: a.lake_id,
    lakeName: a.lakes?.name || 'Unknown Lake',
    severity: a.severity,
    status: a.status,
    title: a.title,
    description: a.description,
    cause: a.cause,
    recommendation: a.recommendation,
    triggeredBy: a.triggered_by,
    createdAt: a.created_at,
  }))

  // Sort by severity (critical > warning > info)
  const severityOrder: Record<string, number> = {
    critical: 0,
    warning: 1,
    info: 2,
  }
  processed.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  )

  return NextResponse.json(processed)
}
