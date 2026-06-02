import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ recommendation: 'AI consultant is not configured yet. Please add your ANTHROPIC_API_KEY to Vercel environment variables.' })
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ recommendation: 'Our AI consultant is temporarily unavailable. Please browse our collection directly.' })
    }

    const { query, preferences } = await req.json()
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: products } = await supabase
      .from('products')
      .select(`name, description, fragrance_family, concentration, gender_target,
        brand:brands(name),
        variants:product_variants(price, size_ml)`)
      .eq('status', 'active')
      .order('total_sold', { ascending: false })
      .limit(50)

    const productContext = products?.map(p => {
      const price = (p.variants as any[])?.[0]?.price
      return `${(p.brand as any)?.name} ${p.name} — ${p.fragrance_family}, ${p.concentration?.toUpperCase()}, ${p.gender_target}, from QAR ${price}`
    }).join('\n') ?? ''

    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const systemPrompt = `You are an expert luxury fragrance consultant at Maison Noir, a premium perfume boutique in Qatar.
Prices are in QAR (Qatar Riyal). Recommend only products from our inventory below.
Available products:\n${productContext}
Guidelines: Recommend 3-5 products, mention notes and occasions, use elegant language, format as **Product Name** by Brand — reasoning.`

    const userMessage = preferences
      ? `Preferences: Gender: ${preferences.gender}, Budget: QAR ${preferences.budget}, Season: ${preferences.season}, Mood: ${preferences.mood}\n\nQuery: ${query}`
      : query

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const recommendation = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ recommendation })

  } catch (error: any) {
    console.error('AI route error:', error)
    return NextResponse.json({ recommendation: 'Unable to get recommendations at this time. Please browse our collection.' })
  }
}
