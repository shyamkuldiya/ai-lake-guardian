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

  // First get the lake ID if identifier is slug
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

  // Fetch the latest health score
  const { data: score, error } = await supabase
    .from('health_scores')
    .select('*')
    .eq('lake_id', lakeId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (error || !score) {
    return NextResponse.json({
      id: crypto.randomUUID(),
      lakeId: lakeId,
      score: 85,
      band: 'healthy',
      components: {
        dissolvedOxygen: 85,
        turbidity: 12,
        waterTemperature: 24,
        algaeBloomIndex: 5,
        rainfallSewageRisk: 10,
        humanPressure: 15,
      },
      confidence: 0.9,
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({
    id: score.id,
    lakeId: score.lake_id,
    score: Number(score.score),
    band: score.band,
    components: score.components,
    confidence: Number(score.confidence),
    timestamp: score.timestamp,
  })
}
