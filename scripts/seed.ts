import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const LAKES = [
  {
    name: 'Pichola Lake',
    slug: 'pichola',
    description:
      'Pichola Lake is an artificial fresh water lake, created in 1362 AD. It is one of the most famous lakes in Udaipur, known for its scenic beauty and the Lake Palace.',
    location: { latitude: 24.5764, longitude: 73.6827 },
    area_sq_km: 6.96,
  },
  {
    name: 'Fateh Sagar Lake',
    slug: 'fateh-sagar',
    description:
      'Fateh Sagar Lake is an artificial lake named after Maharana Fateh Singh. It is a popular spot for boating and evening walks.',
    location: { latitude: 24.6006, longitude: 73.6784 },
    area_sq_km: 4.0,
  },
  {
    name: 'Udai Sagar Lake',
    slug: 'udai-sagar',
    description:
      'Udai Sagar Lake is one of the five prominent lakes of Udaipur, built by Maharana Udai Singh in 1565.',
    location: { latitude: 24.5478, longitude: 73.7845 },
    area_sq_km: 10.5,
  },
  {
    name: 'Badi Lake',
    slug: 'badi',
    description:
      'Badi Lake is a freshwater lake was built by Maharana Raj Singh I (1652-1680) to counteract the devastating effects of a famine.',
    location: { latitude: 24.6328, longitude: 73.6428 },
    area_sq_km: 1.2,
  },
]

async function seed() {
  console.log('🌱 Starting seed...')

  for (const lake of LAKES) {
    console.log(`Inserting ${lake.name}...`)
    const { data: insertedLake, error: lakeError } = await supabase
      .from('lakes')
      .upsert(lake, { onConflict: 'slug' })
      .select()
      .single()

    if (lakeError) {
      console.error(`Error inserting lake ${lake.name}:`, lakeError)
      continue
    }

    // Insert mock health score
    const { error: scoreError } = await supabase.from('health_scores').insert({
      lake_id: insertedLake.id,
      score: Math.floor(Math.random() * 40) + 50, // 50-90
      band: 'healthy',
      components: {
        dissolvedOxygen: 85,
        turbidity: 12,
        waterTemperature: 24,
        algaeBloomIndex: 5,
        rainfallSewageRisk: 10,
        humanPressure: 15,
      },
      confidence: 0.95,
    })

    if (scoreError) console.error('Error inserting health score:', scoreError)

    // Insert some mock alerts for some lakes
    if (Math.random() > 0.5) {
      await supabase.from('alerts').insert({
        lake_id: insertedLake.id,
        title: 'Increased Turbidity Detected',
        description:
          'Satellite imagery indicates a rise in suspended solids near the southern inlet.',
        severity: 'warning',
        status: 'active',
        cause: 'Recent construction activity near the catchment area.',
        recommendation:
          'Inspect the silt traps and divert inflow if necessary.',
        triggered_by: 'Satellite Analysis Engine',
      })
    }
  }

  console.log('✅ Seed completed!')
}

seed()
