import { useState } from "react";
import { GazePoint, FocusSession } from "@/lib/focus/session";
import { computeMetrics } from "@/lib/focus/metrics";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useFocusSession() {
  const [gazeData, setGazeData] = useState<GazePoint[]>([]);
  const [session, setSession] = useState<FocusSession | null>(null);
  const [fileProtocol, setFileProtocol] = useState<string>("");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuth();

  const startSession = (protocol?: string) => {
    if (!user) {
      console.log("❌ Cannot start session - no user");
      return;
    }

    console.log("🚀 Starting new session for user:", user.id);
    const startTime = Date.now();

    setGazeData([]);
    setFileProtocol(protocol || "");
    setSession({ startTime, endTime: 0, gazeData: [] });

    // Clear old backups
    localStorage.removeItem("fovea_session_gaze_data");
    localStorage.removeItem("fovea_session_metadata");

    // Save metadata locally (no DB yet)
    localStorage.setItem(
      "fovea_session_metadata",
      JSON.stringify({
        startTime,
        userId: user.id,
        fileProtocol: protocol || null,
      })
    );
  };

  const addPoint = (point: GazePoint) => {
    if (isPaused) return;

    setGazeData((prev) => {
      const newData = [...prev, point];
      try {
        localStorage.setItem(
          "fovea_session_gaze_data",
          JSON.stringify(newData)
        );
      } catch (err) {
        console.warn("⚠️ Failed to save gaze data:", err);
      }
      return newData;
    });
  };

  const pauseSession = () => setIsPaused(true);
  const resumeSession = () => setIsPaused(false);

  const endSession = async () => {
    if (!session || !user) return;

    try {
      window.webgazer?.end();
      const endTime = Date.now();

      // Prefer localStorage data (more complete if tab was inactive at times)
      let finalGazeData = gazeData;
      try {
        const stored = localStorage.getItem("fovea_session_gaze_data");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.length > finalGazeData.length) {
            finalGazeData = parsed;
          }
        }
      } catch (err) {
        console.warn("⚠️ Could not read localStorage gaze data:", err);
      }

      console.log("🧮 Computing metrics for", finalGazeData.length, "points");
      const metrics = computeMetrics(finalGazeData, session.startTime, endTime);

      // Insert complete session in DB (first and only write!)
      const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
          user_id: user.id,
          start_time: new Date(session.startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          gaze_data: finalGazeData,
          metrics,
          file_protocol: fileProtocol || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("✅ Session saved with ID:", data.id);

      // Clean up backups
      localStorage.removeItem("fovea_session_gaze_data");
      localStorage.removeItem("fovea_session_metadata");

      // Track prev_files if file was used
      if (fileProtocol) {
        const fileName = fileProtocol.split("/").pop() || fileProtocol;
        await supabase.from("prev_files").upsert(
          {
            user_id: user.id,
            file_protocol: fileProtocol,
            file_name: fileName,
            last_accessed: new Date().toISOString(),
          },
          { onConflict: "user_id,file_protocol" }
        );
      }

      // Navigate to results
      router.push(`/results?session=${data.id}`);
    } catch (err) {
      console.error("❌ Error ending session:", err);
      router.push("/results");
    }
  };

  return {
    startSession,
    addPoint,
    endSession,
    pauseSession,
    resumeSession,
    isPaused,
    session,
    setFileProtocol,
  };
}
