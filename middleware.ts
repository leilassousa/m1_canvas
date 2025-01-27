import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected route
  if (!session && (req.nextUrl.pathname.startsWith('/reports') || req.nextUrl.pathname.startsWith('/assessment'))) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // Check subscription status for premium features
  if (session && req.nextUrl.pathname.startsWith('/reports')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.subscription_status !== 'active') {
      return NextResponse.redirect(new URL('/pricing', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/reports/:path*', '/assessment/:path*'],
} 