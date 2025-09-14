"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FocusSummary from "@/components/FocusSummary";
import { FocusSession } from "@/lib/focus/session";
import NavBar from "@/components/NavBar";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { Suspense } from 'react';

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  );
}
function Results() {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSession = async () => {
      const sessionId = searchParams.get('session');
      
      if (!sessionId || !user) {
        setError("No session ID provided or user not authenticated");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching session data for ID:", sessionId);

      try {
        const { data, error } = await supabase
          .from('focus_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          console.log("📊 Session data retrieved:", {
            gazeDataLength: data.gaze_data?.length || 0,
            hasMetrics: !!data.metrics,
            startTime: data.start_time,
            endTime: data.end_time
          });

          // Verify we have complete data
          if (!data.gaze_data && data.gaze_data.length > 0) {
            setError("No gaze data found in session");
            setLoading(false);
            return;
          }

          if (!data.metrics || Object.keys(data.metrics).length === 0) {
            setError("Session metrics not computed yet");
            setLoading(false);
            return;
          }

          // Convert database format to FocusSession format
          const focusSession: FocusSession = {
            startTime: new Date(data.start_time).getTime(),
            endTime: new Date(data.end_time).getTime(),
            gazeData: data.gaze_data,
            metrics: data.metrics,
            claudeAnalysis: data.claude_analysis
          };
          
          console.log("✅ Session data ready for display");
          setSession(focusSession);
        } else {
          setError("Session not found");
        }
      } catch (err) {
        console.error('❌ Error fetching session:', err);
        setError("Failed to load session data");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [searchParams, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <div className="text-center">
          <p className="text-error mb-4">{error || "No session data found"}</p>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <NavBar />
    <FocusSummary
      data={session.gazeData}
      start={session.startTime}
      end={session.endTime}
      claudeAnalysis={session.claudeAnalysis}
    />
    </>
  );
}
