import { NextResponse } from 'next/server'
import { MOCK_LAKES, generateMockPredictions } from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Find the lake to get current score
  const lake = MOCK_LAKES.find((l) => l.slug === slug)
  const currentScore = lake?.currentScore ?? 75

  // Generate predictions
  const predictions = generateMockPredictions(lake?.id ?? slug, currentScore)

  return NextResponse.json(predictions)
}
