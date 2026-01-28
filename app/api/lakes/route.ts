import { NextResponse } from 'next/server'
import { MOCK_LAKES } from '@/lib/mock-data'

export async function GET() {
  // In production, this would query Supabase
  // For now, return mock data
  return NextResponse.json(MOCK_LAKES)
}
