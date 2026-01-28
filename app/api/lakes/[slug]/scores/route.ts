import { NextResponse } from 'next/server'
import { generateMockScoreHistory } from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '7d'

  // Determine number of days based on range
  const days = range === '90d' ? 90 : range === '30d' ? 30 : 7

  // Generate mock history (in production, would query Supabase)
  const history = generateMockScoreHistory(slug, days)

  // Sample data to reduce payload size for longer ranges
  const sampledHistory =
    days > 7
      ? history.filter((_, i) => i % Math.ceil(days / 30) === 0)
      : history

  return NextResponse.json(sampledHistory)
}
