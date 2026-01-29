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

  // Fetch the latest readings
  const { data: readings, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .eq('lake_id', lakeId)
    .order('timestamp', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Handle empty state with mock auto-generation
  if (!readings || readings.length === 0) {
    const sensorTypes = [
      'dissolved_oxygen',
      'turbidity',
      'water_temperature',
      'algae_bloom_index',
      'rainfall_sewage_risk',
      'human_pressure',
    ]
    const initialReadings = sensorTypes.map((type) => ({
      lake_id: lakeId,
      sensor_type: type,
      value: Math.floor(Math.random() * 30) + 70,
      confidence: 0.9,
      unit: '%',
      timestamp: new Date().toISOString(),
    }))

    // Attempt to save them
    await supabase.from('sensor_readings').insert(initialReadings)
    return NextResponse.json(
      initialReadings.map((r) => ({ ...r, sensorType: r.sensor_type }))
    )
  }

  const uniqueLatest: any[] = []
  const handledTypes = new Set()
  readings.forEach((r) => {
    if (!handledTypes.has(r.sensor_type)) {
      uniqueLatest.push({
        ...r,
        sensorType: r.sensor_type,
        value: Number(r.value),
      })
      handledTypes.add(r.sensor_type)
    }
  })

  return NextResponse.json(uniqueLatest)
}
