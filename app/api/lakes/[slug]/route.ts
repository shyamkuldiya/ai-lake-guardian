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

  const query = supabase.from('lakes').select('*')

  if (isUuid) {
    query.eq('id', identifier)
  } else {
    query.eq('slug', identifier)
  }

  const { data: lake, error } = await query.single()

  if (error || !lake) {
    return NextResponse.json({ error: 'Lake not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: lake.id,
    name: lake.name,
    slug: lake.slug,
    description: lake.description,
    location: lake.location,
    areaSquareKm: lake.area_sq_km,
    createdAt: lake.created_at,
    updatedAt: lake.updated_at,
  })
}
