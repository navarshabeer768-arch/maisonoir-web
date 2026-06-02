import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that won't crash during build/prerender
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Database not configured' } }),
        signUp: async () => ({ data: null, error: { message: 'Database not configured' } }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ data: null, error: { message: 'Database not configured' } }),
        resend: async () => ({ data: null, error: null }),
        signInWithOAuth: async () => ({ data: null, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), maybeSingle: async () => ({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: async () => ({ data: null, error: null }) }) }),
        upsert: () => ({ select: async () => ({ data: null, error: null }) }),
        delete: () => ({ eq: async () => ({ data: null, error: null }) }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: { message: 'Storage not configured' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
