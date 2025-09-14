import { useState } from "react";
import { GazePoint, FocusSession } from "@/lib/focus/session";
import { computeMetrics } from "@/lib/focus/metrics";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * useFocusSession()
 * Manages states and database persistence (no localStorage)
 */
export function useFocusSession() {
  const [gazeData, setGazeData] = useState<GazePoint[]>([]);
  const [session, setSession] = useState<FocusSession | null>(null);
  const [fileProtocol, setFileProtocol] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuth();

  // Recovery function for incomplete sessions
  const recoverIncompleteSession = () => {
    try {
      const storedMetadata = localStorage.getItem('fovea_session_metadata');
      const storedGazeData = localStorage.getItem('fovea_session_gaze_data');
      
      if (storedMetadata && storedGazeData && user) {
        const metadata = JSON.parse(storedMetadata);
        const gazePoints = JSON.parse(storedGazeData);
        
        // Check if this is the same user and session is recent (within 24 hours)
        const sessionAge = Date.now() - metadata.startTime;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (metadata.userId === user.id && sessionAge < maxAge && gazePoints.length > 0) {
          console.log("🔄 Found incomplete session with", gazePoints.length, "gaze points");
          return {
            sessionId: metadata.sessionId,
            gazeData: gazePoints,
            startTime: metadata.startTime,
            fileProtocol: metadata.fileProtocol
          };
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to recover incomplete session:', error);
    }
    return null;
  };

  const startSession = async (protocol?: string) => {
    if (!user) {
      console.log("❌ Cannot start session - no user");
      return;
    }
    
    console.log("🚀 Starting new session for user:", user.id);
    setGazeData([]);
    setFileProtocol(protocol || "");
    const startTime = Date.now();
    setSession({ startTime, endTime: 0, gazeData: [] });
    
    // Clear any existing localStorage data
    localStorage.removeItem('fovea_session_gaze_data');
    localStorage.removeItem('fovea_session_metadata');
    
    // Create session in database immediately
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: user.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(startTime).toISOString(), // Will be updated on end
        gaze_data: [],
        metrics: {},
        file_protocol: protocol || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating session:', error);
    } else {
      console.log("✅ Session created with ID:", data.id);
      setSessionId(data.id);
      
      // Store session metadata in localStorage
      localStorage.setItem('fovea_session_metadata', JSON.stringify({
        sessionId: data.id,
        startTime,
        userId: user.id,
        fileProtocol: protocol || null
      }));
    }
  };

  const addPoint = (point: GazePoint) => {
    // Only add points if session is not paused
    if (isPaused) return;
    
    // Accumulate in memory and store in localStorage as backup
    setGazeData(prev => {
      const newGazeData = [...prev, point];
      
      // Store in localStorage for backup
      try {
        localStorage.setItem('fovea_session_gaze_data', JSON.stringify(newGazeData));
      } catch (error) {
        console.warn('⚠️ Failed to store gaze data in localStorage:', error);
      }
      
      return newGazeData;
    });
  };

  const pauseSession = () => {
    console.log("⏸️ Pausing session");
    setIsPaused(true);
  };

  const resumeSession = () => {
    console.log("▶️ Resuming session");
    setIsPaused(false);
  };

  const endSession = async () => {
    if (!session || !sessionId || !user) return;
    
    try {
      window.webgazer.end();
      const endTime = Date.now();
      
      // Get gaze data from localStorage as primary source
      let finalGazeData = gazeData;
      try {
        const storedGazeData = localStorage.getItem('fovea_session_gaze_data');
        if (storedGazeData) {
          const parsedData = JSON.parse(storedGazeData);
          if (parsedData.length > finalGazeData.length) {
            console.log("📦 Using localStorage data (more complete):", parsedData.length, "vs", finalGazeData.length);
            finalGazeData = parsedData;
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to read from localStorage, using memory data:', error);
      }
      
      console.log("🧮 Computing metrics for", finalGazeData.length, "gaze points");
      const metrics = computeMetrics(finalGazeData, session.startTime, endTime);
      console.log("📊 Computed metrics:", metrics);
      
      // Update existing session in database with ALL final data
      console.log("💾 Saving complete session to database...");
      const { error } = await supabase
        .from('focus_sessions')
        .update({
          end_time: new Date(endTime).toISOString(),
          gaze_data: finalGazeData,
          metrics: metrics
        })
        .eq('id', sessionId);

      if (error) {
        console.error('❌ Error updating session in database:', error);
        throw error;
      }
      
      console.log("✅ Session data saved successfully");
      
      // Clear localStorage after successful database save
      localStorage.removeItem('fovea_session_gaze_data');
      localStorage.removeItem('fovea_session_metadata');

      // Update prev_files if file was used
      if (fileProtocol) {
        const fileName = fileProtocol.split('/').pop() || fileProtocol;
        await supabase
          .from('prev_files')
          .upsert({
            user_id: user.id,
            file_protocol: fileProtocol,
            file_name: fileName,
            last_accessed: new Date().toISOString()
          }, {
            onConflict: 'user_id,file_protocol'
          });
      }

      // Navigate to results with session ID
      console.log("🔄 Navigating to results page");
      router.push(`/results?session=${sessionId}`);
    } catch (error) {
      console.error('❌ Error ending session:', error);
      // Still navigate to results even if DB save fails
      router.push("/results");
    }
  };

  return { 
    startSession, 
    addPoint, 
    endSession, 
    session, 
    setFileProtocol, 
    recoverIncompleteSession,
    pauseSession,
    resumeSession,
    isPaused
  };
}
