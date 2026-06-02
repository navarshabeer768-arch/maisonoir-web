import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), maybeSingle: async () => ({ data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }) }) }), neq: () => ({ single: async () => ({ data: null, error: null }), limit: async () => ({ data: [], error: null }) }), ilike: () => ({ order: () => ({ range: async () => ({ data: [], count: 0, error: null }) }) }), order: () => ({ limit: () => ({ data: [], error: null }), range: async () => ({ data: [], count: 0, error: null }) }), range: async () => ({ data: [], count: 0, error: null }), maybeSingle: async () => ({ data: null, error: null }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }), async then() { return { data: null, error: null } } }),
        update: () => ({ eq: async () => ({ data: null, error: null }) }),
        upsert: async () => ({ data: null, error: null }),
      }),
      storage: { from: () => ({ upload: async () => ({ data: null, error: null }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    } as any
  }

  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
      },
    },
  })
}

export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), maybeSingle: async () => ({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: async () => ({ data: null, error: null }) }),
        upsert: async () => ({ data: null, error: null }),
      }),
    } as any
  }

  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, serviceKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
      },
    },
  })
}
