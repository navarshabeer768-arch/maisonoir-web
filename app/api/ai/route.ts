import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { query, preferences } = await req.json()
    const supabase = await createClient()

    // Fetch available products as context
    const { data: products } = await supabase
      .from('products')
      .select(`
        name, description, fragrance_family, concentration, gender_target,
        brand:brands(name),
        variants:product_variants(price, size_ml),
        notes:product_notes(note_type, note:fragrance_notes(name))
      `)
      .eq('status', 'active')
      .order('total_sold', { ascending: false })
      .limit(50)

    const productContext = products?.map(p => {
      const notes = (p.notes as any[])?.map((n: any) => `${n.note_type}: ${n.note.name}`).join(', ')
      const price = (p.variants as any[])?.[0]?.price
      return `${(p.brand as any)?.name} ${p.name} — ${p.fragrance_family}, ${p.concentration?.toUpperCase()}, ${p.gender_target}, from $${price} — Notes: ${notes}`
    }).join('\n')

    const systemPrompt = `You are an expert luxury fragrance consultant at Maison Noir, a premium perfume boutique. You have deep knowledge of perfumery, fragrance families, notes, and brands.

Available products in our current inventory:
${productContext}

Guidelines:
- Recommend only products from our inventory above
- Provide specific, expert recommendations with reasoning
- Mention fragrance notes, occasions, seasons
- Use elegant, luxury-appropriate language
- Limit to 3-5 recommendations per query
- Format: **Product Name** by Brand — Brief reasoning
- End with a personalized closing note`

    const userMessage = preferences
      ? `Customer preferences: Gender: ${preferences.gender}, Budget: $${preferences.budget}, Season: ${preferences.season}, Mood: ${preferences.mood}\n\nQuery: ${query}`
      : query

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const recommendation = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ recommendation })

  } catch (error) {
    console.error('AI consultant error:', error)
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
}
