'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';
import type { Database } from '@/types/supabase';
import { useAuth } from '@/lib/auth/auth-context';

interface Assessment {
  id: string;
  title: string;
  created_at: string;
  status: string;
}

export function ReportsSection() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    let mounted = true;

    async function fetchCompletedAssessments() {
      if (!mounted || !user) return;

      try {
        setLoading(true);
        console.log('Starting fetch with user:', user.id);

        const { data, error } = await supabase
          .from('assessments')
          .select('id, title, created_at, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        if (mounted) {
          console.log('Successfully fetched assessments:', data);
          setAssessments(data || []);
        }
      } catch (error) {
        console.error('Error in fetchCompletedAssessments:', error);
        toast({
          title: "Error",
          description: "Failed to load assessments. Please try refreshing the page.",
          variant: "destructive",
        });
        setAssessments([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchCompletedAssessments();

    // Set up real-time subscription for assessments
    const assessmentsSubscription = supabase
      .channel('assessments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          console.log('Assessment changed, refreshing...');
          fetchCompletedAssessments();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      assessmentsSubscription.unsubscribe();
    };
  }, [supabase, user]);

  const handleViewReport = (assessmentId: string) => {
    console.log('Navigating to report:', assessmentId);
    router.push(`/reports/${assessmentId}`);
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

  if (!user) {
    return (
      <Card className="p-6 bg-white h-[600px]">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-gray-500">Please log in to view your assessments</p>
          <Button 
            onClick={() => router.push('/auth')}
            variant="outline"
          >
            Log In
          </Button>
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