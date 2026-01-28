import { NextResponse } from 'next/server'
import { MOCK_LAKES, generateMockSensorReadings } from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Find the lake
  const lake = MOCK_LAKES.find((l) => l.slug === slug)

  // Generate sensor readings
  const sensors = generateMockSensorReadings(lake?.id ?? slug)

  return NextResponse.json(sensors)
}
