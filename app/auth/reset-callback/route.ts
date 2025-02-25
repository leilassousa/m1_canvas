import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Reset callback received with code:', code ? 'Code exists' : 'No code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Password reset error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=Unable to reset password`)
      }
      
      console.log('Successfully exchanged code for session');
      
      // Redirect to the reset password page
      return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`)
    } catch (err) {
      console.error('Exception in reset callback:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=An error occurred during password reset`)
    }
  } else {
    console.log('No code provided in reset callback');
  }

  // Redirect to the reset password page even if no code (will handle error there)
  return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`)
} 