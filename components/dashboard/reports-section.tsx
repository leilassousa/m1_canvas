'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';
import type { Database } from '@/types/supabase';

interface Assessment {
  id: string;
  title: string;
  created_at: string;
  status: string;
}

export function ReportsSection() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompletedAssessments() {
      try {
        console.log('Fetching completed assessments...'); // Debug log

        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log('No active session found'); // Debug log
          return;
        }

        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(5); // Show last 5 completed assessments

        if (error) {
          console.error('Error fetching assessments:', error); // Debug log
          throw error;
        }

        console.log('Fetched assessments:', data); // Debug log
        setAssessments(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load assessments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedAssessments();
  }, [supabase]);

  const handleViewReport = (assessmentId: string) => {
    console.log('Navigating to report for assessment:', assessmentId); // Debug log
    router.push(`/reports?assessment_id=${assessmentId}`);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white h-[600px]">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading assessments...</p>
        </div>
      </Card>
    );
  }

  if (!assessments.length) {
    return (
      <Card className="p-6 bg-white h-[600px]">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-gray-500">No completed assessments found</p>
          <Button 
            onClick={() => router.push('/assessment')}
            variant="outline"
          >
            Start New Assessment
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white h-[600px]">
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-900">
                {assessment.title || 'Business Assessment'}
              </span>
              <p className="text-xs text-gray-500">
                Completed: {new Date(assessment.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => handleViewReport(assessment.id)}
              aria-label={`View report for assessment completed on ${new Date(assessment.created_at).toLocaleDateString()}`}
            >
              View
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}