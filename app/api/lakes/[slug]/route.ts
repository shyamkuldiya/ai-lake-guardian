import { NextResponse } from 'next/server'
import {
  MOCK_LAKE_DETAILS,
  MOCK_LAKES,
  generateMockHealthScore,
} from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Try to get from detailed mock data first
  const lake = MOCK_LAKE_DETAILS[slug]

  if (lake) {
    return NextResponse.json(lake)
  }

  // Fallback to list data
  const listItem = MOCK_LAKES.find((l) => l.slug === slug)

  if (listItem) {
    return NextResponse.json({
      id: listItem.id,
      name: listItem.name,
      slug: listItem.slug,
      location: listItem.location,
      areaSquareKm: 5.0, // Default
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    })
  }

  return NextResponse.json({ error: 'Lake not found' }, { status: 404 })
}
