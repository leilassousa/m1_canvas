import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
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

    // Get the answer data from the request
    const answerData = await request.json();

    // Validate required fields
    const requiredFields = ['question_id', 'value', 'category', 'confidence_value', 'knowledge_value'];
    for (const field of requiredFields) {
      if (!(field in answerData)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save the answer
    const { data: answer, error: answerError } = await supabase
      .from('answers')
      .insert({
        assessment_id,
        question_id: answerData.question_id,
        value: answerData.value,
        text: answerData.text || null,
        category: answerData.category,
        confidence_level: answerData.confidence_value,
        knowledge_level: answerData.knowledge_value,
      })
      .select()
      .single();

    if (answerError) {
      console.error('Error saving answer:', answerError);
      return NextResponse.json(
        { error: 'Failed to save answer' },
        { status: 500 }
      );
    }

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all answers for an assessment
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

    // Get all answers for the assessment
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('*')
      .eq('assessment_id', assessment_id)
      .order('created_at', { ascending: true });

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      return NextResponse.json(
        { error: 'Failed to fetch answers' },
        { status: 500 }
      );
    }

    return NextResponse.json(answers);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 