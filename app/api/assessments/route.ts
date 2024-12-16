import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user session with detailed logging
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Auth Session:', session);
    console.log('Session Error:', sessionError);

    if (sessionError) {
      console.error('Session Error Details:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error', details: sessionError.message },
        { status: 401 }
      );
    }

    if (!session) {
      console.log('No session found');
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    console.log('Creating assessment for user:', session.user.id);

    // Create a new assessment with detailed error logging
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: session.user.id,
        status: 'draft',
        title: `Assessment ${new Date().toLocaleDateString()}`,
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Assessment Creation Error:', assessmentError);
      console.error('Error Details:', {
        code: assessmentError.code,
        message: assessmentError.message,
        details: assessmentError.details,
        hint: assessmentError.hint
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to create assessment',
          details: assessmentError.message,
          code: assessmentError.code 
        },
        { status: 500 }
      );
    }

    console.log('Assessment created successfully:', assessment);
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Unexpected error in assessment creation:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get user's assessments
export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all assessments for the user
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (assessmentsError) {
      console.error('Error fetching assessments:', assessmentsError);
      return NextResponse.json(
        { error: 'Failed to fetch assessments' },
        { status: 500 }
      );
    }

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 