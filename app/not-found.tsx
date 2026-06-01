import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: '24px', textAlign: 'center' }}>
      <div style={{ marginBottom: '16px', fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 600 }}>
        404
      </div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 300, color: '#2A2420', lineHeight: 1, marginBottom: '16px' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#9A8A7A', marginBottom: '40px', maxWidth: '360px', lineHeight: 2 }}>
        The page you are looking for does not exist or has been moved
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/shop" style={{ padding: '14px 32px', background: '#2A2420', color: 'white', textDecoration: 'none', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>
          Browse Collection
        </Link>
        <Link href="/" style={{ padding: '14px 32px', border: '1px solid #C9A84C', color: '#C9A84C', textDecoration: 'none', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Go Home
        </Link>
      </div>
    </div>
  )
}
