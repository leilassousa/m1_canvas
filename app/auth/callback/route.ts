import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=Unable to verify your email`)
    }

    if (session) {
      // Check if there's a beta code in the URL params
      const betaCode = requestUrl.searchParams.get('beta_code')
      
      if (betaCode) {
        // Update user's profile with beta access
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            is_beta_user: true,
            beta_code_used: betaCode
          })
          .eq('id', session.user.id)

        if (updateError) {
          console.error('Error updating profile:', updateError)
          return NextResponse.redirect(`${requestUrl.origin}/auth?error=Failed to activate beta access`)
        }

        // Redirect to onboarding after successful beta activation
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
      }
    }
  }

  // Default redirect to dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
} 