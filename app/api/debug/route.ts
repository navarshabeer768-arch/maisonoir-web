import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  let connectionTest = 'not tested'
  try {
    const res = await fetch(`${url}/rest/v1/products?select=name&limit=1`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
      },
      cache: 'no-store'
    })
    const text = await res.text()
    connectionTest = `HTTP ${res.status}: ${text.slice(0, 150)}`
  } catch (e: any) {
    connectionTest = `Error: ${e.message}`
  }
  return NextResponse.json({ supabaseUrl: url, hasAnon, hasService, connectionTest })
}
