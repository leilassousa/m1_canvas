import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { assessment_id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { assessment_id } = params;

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the update data from the request
    const updateData = await request.json();

    // Verify the assessment belongs to the user
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessment_id)
      .eq('user_id', session.user.id)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Update the assessment
    const { data: updatedAssessment, error: updateError } = await supabase
      .from('assessments')
      .update({
        status: updateData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessment_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating assessment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get a single assessment
export async function GET(
  request: Request,
  { params }: { params: { assessment_id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { assessment_id } = params;

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the assessment with its answers
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        *,
        answers (*)
      `)
      .eq('id', assessment_id)
      .eq('user_id', session.user.id)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 