import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Mock upload - just return a fake URL
  // In production, upload to Supabase Storage

  return NextResponse.json({
    url: 'https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?q=80&w=1000&auto=format&fit=crop',
  })
}
