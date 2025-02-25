import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Password reset error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=Unable to reset password`)
    }
  }

  // Redirect to the reset password page
  return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`)
} 