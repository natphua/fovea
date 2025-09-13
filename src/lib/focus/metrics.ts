import { GazePoint, FocusMetrics } from "./session";

export function computeMetrics(data: GazePoint[], start: number, end: number): FocusMetrics {
  const duration = (end - start) / 1000; // seconds
  // placeholder logic (replace with real heuristics)
  const focusedTime = duration * 0.75;

  return {
    focusScore: Math.round((focusedTime / duration) * 100),
    sessionSummary: `You stayed focused for ${Math.round(focusedTime/60)} out of ${Math.round(duration/60)} minutes`,
    attentionStability: "Medium",
    stabilityGraph: [0.2, 0.5, 0.3],
    peakFocusWindow: "Minutes 12–22",
    distractionRecovery: "Average 4 seconds to refocus",
    contentEngagement: ["Main reading panel"],
  };
}
