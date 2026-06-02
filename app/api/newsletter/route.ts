import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email?.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = await createAdminClient()
      await supabase.from('email_subscriptions').upsert(
        { email, is_subscribed: true, source: 'newsletter_section' },
        { onConflict: 'email' }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
