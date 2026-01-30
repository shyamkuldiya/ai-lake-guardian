'use client'

import { Header } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Our Methodology
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Understanding how AI Lake Guardian monitors, calculates, and
            predicts the health of Udaipur's vital water bodies.
          </p>
        </div>

        {/* 1. The scoring system */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              1
            </div>
            <h2 className="text-3xl font-bold">Health Score Calculation</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Our "Global Lake Index" is a composite score (0-100) derived from
            six key ecological indicators. Each indicator is weighted according
            to its impact on the immediate survival of aquatic life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Dissolved Oxygen',
                weight: '25%',
                desc: 'Primary indicator for aquatic respiration.',
              },
              {
                name: 'Turbidity',
                weight: '20%',
                desc: 'Cloudiness of water, indicates silt or pollution.',
              },
              {
                name: 'Rainfall Sewage Risk',
                weight: '15%',
                desc: 'Likelihood of overflow during monsoon events.',
              },
              {
                name: 'Algae Bloom Index',
                weight: '15%',
                desc: 'Satellite-detected chlorophyll levels.',
              },
              {
                name: 'Water Temperature',
                weight: '15%',
                desc: 'Affects chemical balance and oxygen levels.',
              },
              {
                name: 'Human Pressure',
                weight: '10%',
                desc: 'Proximity to urbanization and encroachment.',
              },
            ].map((idx) => (
              <Card key={idx.name} className="border-muted bg-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{idx.name}</h3>
                    <p className="text-xs text-muted-foreground">{idx.desc}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {idx.weight} Weight
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* 2. Rating System */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              2
            </div>
            <h2 className="text-3xl font-bold">The Rating Bands</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            We categorize lake health into four clinical bands, allowing
            authorities to prioritize response.
          </p>

          <div className="space-y-4">
            {[
              {
                band: 'Healthy',
                range: '80 - 100',
                colorVar: 'var(--color-healthy)',
                desc: 'Optimal conditions. Ecosystem is self-sustaining and vibrant.',
              },
              {
                band: 'At Risk',
                range: '60 - 79',
                colorVar: 'var(--color-at_risk)',
                desc: 'Mild degradation. Requires investigation of inflow sources.',
              },
              {
                band: 'Degrading',
                range: '40 - 59',
                colorVar: 'var(--color-degrading)',
                desc: 'Active decline. Intervention required to prevent species loss.',
              },
              {
                band: 'Critical',
                range: '0 - 39',
                colorVar: 'var(--color-critical)',
                desc: 'Ecosystem collapse. Immediate emergency measures recommended.',
              },
            ].map((r) => (
              <div
                key={r.band}
                className="flex items-start gap-4 p-4 rounded-xl border bg-muted/30"
              >
                <div
                  className="w-4 h-4 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: r.colorVar }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-lg">{r.band}</h3>
                    <span className="font-mono text-sm font-bold bg-muted px-2 py-0.5 rounded">
                      {r.range}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* 3. Predictive AI */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xl">
              ✨
            </div>
            <h2 className="text-3xl font-bold">How our AI Warns Quickly</h2>
          </div>
          <Card className="bg-primary/5 border-primary/20 overflow-hidden">
            <CardHeader>
              <CardTitle>Rapid Entropy Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Unlike traditional systems that wait for a lab test, AI Lake
                Guardian focuses on <strong>Virtual Sensor Flux</strong>. Our AI
                (Gemini 2.0 Flash) monitors non-linear correlation between data
                points.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">Inflow Analysis</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Cross-references weather forecasts with topography to
                    predict sewage overflow 48 hours before the rain starts.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">Sentinel-2 Vision</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Analyzes satellite spectral bands to detect early-stage
                    algae blooms invisible to the human eye from the shore.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">Anomaly Logic</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If Temperature rises and Turbidity drops simultaneously, the
                    AI flags a potential chemical dumping event in real-time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="pt-12 text-center text-sm text-muted-foreground">
          <p>© 2026 AI Lake Guardian • Built for Udaipur Hackathon</p>
        </footer>
      </main>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
