import { NextResponse } from 'next/server'
import type { CitizenReport, ReportFormData } from '@/lib/schemas/report'

export async function POST(request: Request) {
  try {
    const data: ReportFormData & { imageUrl: string } = await request.json()

    // In a real app, validate with Zod here too

    // Create mock response
    const newReport: CitizenReport = {
      id: crypto.randomUUID(),

      ...data,
      status: 'pending',
      location: { latitude: 24.5854, longitude: 73.7125 }, // Default to center, or use data.location
      submittedAt: new Date(),
      imageUrl: data.imageUrl,
    }

    return NextResponse.json(newReport)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process report' },
      { status: 400 }
    )
  }
}

export async function GET() {
  // Return empty list for now or some mock reports
  return NextResponse.json([])
}
