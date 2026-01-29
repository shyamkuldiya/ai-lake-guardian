import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ReportFormData } from '@/lib/schemas/report'

export async function POST(request: Request) {
  try {
    const data: ReportFormData & { imageUrl: string } = await request.json()
    const supabase = await createClient()

    // Insert into Supabase
    const { data: newReport, error } = await supabase
      .from('citizen_reports')
      .insert({
        lake_id: data.lakeId,
        report_type: data.reportType,
        description: data.description,
        location: data.location,
        image_url: data.imageUrl,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newReport)
  } catch (error) {
    console.error('Report submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process report' },
      { status: 400 }
    )
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('citizen_reports')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
