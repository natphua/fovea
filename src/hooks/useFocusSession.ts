import { useState } from "react";
import { GazePoint, FocusSession } from "@/lib/focus/session";
import { computeMetrics } from "@/lib/focus/metrics";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * useFocusSession()
 * Manages states, local storage, and database persistence
 */
export function useFocusSession() {
  const [gazeData, setGazeData] = useState<GazePoint[]>([]);
  const [session, setSession] = useState<FocusSession | null>(null);
  const [fileProtocol, setFileProtocol] = useState<string>("");
  const router = useRouter();
  const { user } = useAuth();

  const startSession = (protocol?: string) => {
    setGazeData([]);
    setFileProtocol(protocol || "");
    setSession({ startTime: Date.now(), endTime: 0, gazeData: [] });
  };

  const addPoint = (point: GazePoint) => {
    setGazeData(prev => [...prev, point]);
  };

  const endSession = async () => {
    if (!session) return;
    
    try {
      window.webgazer.end();
      const endTime = Date.now();
      const metrics = computeMetrics(gazeData, session.startTime, endTime);
      const fullSession = { ...session, endTime, gazeData, metrics };
      
      // Save to localStorage for immediate access
      setSession(fullSession);
      localStorage.setItem("lastSession", JSON.stringify(fullSession));

      // Save to database if user is authenticated
      if (user) {
        const { error } = await supabase
          .from('focus_sessions')
          .insert({
            user_id: user.id,
            start_time: new Date(session.startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            gaze_data: gazeData,
            metrics: metrics,
            file_protocol: fileProtocol || null
          });

        if (error) {
          console.error('Error saving session to database:', error);
        }

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
      }

      router.push("/results");
    } catch (error) {
      console.error('Error ending session:', error);
      // Still navigate to results even if DB save fails
      router.push("/results");
    }
  };

  return { startSession, addPoint, endSession, session, setFileProtocol };
}
