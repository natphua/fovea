import { useState } from "react";
import { GazePoint, FocusSession } from "@/lib/focus/session";
import { computeMetrics } from "@/lib/focus/metrics";
import { useRouter } from "next/navigation";

/**
 * useFocusSession()
 * Manages states and local storage
 */
export function useFocusSession() {
  const [gazeData, setGazeData] = useState<GazePoint[]>([]);
  const [session, setSession] = useState<FocusSession | null>(null);
  const router = useRouter();

  const startSession = () => {
    setGazeData([]);
    setSession({ startTime: Date.now(), endTime: 0, gazeData: [] });
  };

  const addPoint = (point: GazePoint) => {
    setGazeData(prev => [...prev, point]);
  };

  const endSession = () => {
    if (!session) return;
    window.webgazer.end();
    router.push("/results");
    const endTime = Date.now();
    const metrics = computeMetrics(gazeData, session.startTime, endTime);
    const fullSession = { ...session, endTime, gazeData, metrics };
    setSession(fullSession);
    localStorage.setItem("lastSession", JSON.stringify(fullSession));
  };

  return { startSession, addPoint, endSession, session };
}
