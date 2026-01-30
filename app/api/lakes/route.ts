import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getHealthBand } from '@/lib/schemas/score'

export async function GET() {
  const supabase = await createClient()

  // Fetch lakes with their latest health score
  // We'll use a subquery approach or just fetch and manual join for simplicity in MVP
  const { data: lakes, error: lakesError } = await supabase
    .from('lakes')
    .select('*')
    .order('name')

  if (lakesError) {
    return NextResponse.json({ error: lakesError.message }, { status: 500 })
  }

  // Fetch the latest health score for each lake
  const lakeIds = lakes.map((l) => l.id)
  const { data: scores, error: scoresError } = await supabase
    .from('health_scores')
    .select('*')
    .in('lake_id', lakeIds)
    .order('timestamp', { ascending: false })

  if (scoresError) {
    console.error('Error fetching scores:', scoresError)
  }

  // Create a map of latest scores per lake
  const latestScoresMap: Record<string, any> = {}
  scores?.forEach((score) => {
    if (!latestScoresMap[score.lake_id]) {
      latestScoresMap[score.lake_id] = score
    }
  })

  const processedLakes = lakes.map((lake) => {
    const score = latestScoresMap[lake.id]?.score || 0
    const band = latestScoresMap[lake.id]?.band || getHealthBand(score)

    return {
      id: lake.id,
      name: lake.name,
      slug: lake.slug,
      description: lake.description,
      location: lake.location,
      areaSquareKm: lake.area_sq_km,
      currentScore: score,
      band: band,
      lastUpdated: latestScoresMap[lake.id]?.timestamp || lake.updated_at,
    }
  })

  return NextResponse.json(processedLakes)
}
