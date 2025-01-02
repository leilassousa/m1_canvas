'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import type { Database } from '@/types/supabase';

interface Assessment {
  id: string;
  title: string;
  created_at: string;
  status: string;
  data: any;
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchAssessment = useCallback(async () => {
    if (!params.id) {
      setError('No assessment ID provided');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        setError('Failed to load assessment: ' + error.message);
        return;
      }

      if (!data) {
        setError('Assessment not found');
        return;
      }

      setAssessment(data);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id, supabase]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="p-6 bg-white">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading assessment...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            ) : assessment ? (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {assessment.title || 'Business Assessment Report'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Completed on: {new Date(assessment.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">Assessment Results</h2>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(assessment, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-gray-500">Assessment not found</p>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 