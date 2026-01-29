import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: identifier } = await params
  const isUuid = UUID_REGEX.test(identifier)
  const supabase = await createClient()

  let lakeId = identifier
  if (!isUuid) {
    const { data: lake } = await supabase
      .from('lakes')
      .select('id')
      .eq('slug', identifier)
      .single()
    if (!lake)
      return NextResponse.json({ error: 'Lake not found' }, { status: 404 })
    lakeId = lake.id
  }

  // Fetch active predictions
  const { data: predictions, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('lake_id', lakeId)
    .gt('valid_until', new Date().toISOString())
    .order('prediction_window', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const processed = (predictions || []).map((p) => ({
    id: p.id,
    lakeId: p.lake_id,
    predictionWindow: p.prediction_window,
    predictedScore: Number(p.predicted_score),
    currentScore: Number(p.current_score),
    scoreDelta: Number(p.score_delta),
    riskLevel: p.risk_level,
    confidence: Number(p.confidence),
    causes: p.causes,
    recommendations: p.recommendations,
    explanation: p.explanation,
    generatedAt: p.generated_at,
    validUntil: p.valid_until,
  }))

  return NextResponse.json(processed)
}
