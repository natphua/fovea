/**
 * session.ts
 * file containing types and session object structure 
 */

export interface GazePoint {
  x: number;
  y: number;
  t: number;
}

export interface FocusMetrics {
  focusScore: number;
  sessionSummary: string;
  attentionStability: "High" | "Medium" | "Low" | "N/A";
  stabilityGraph: number[];
  peakFocusWindow: string;
  distractionRecovery: string;
  contentEngagement: string[];
}

export interface FocusSession {
  startTime: number;
  endTime: number;
  gazeData: GazePoint[];
  metrics?: FocusMetrics;
  claudeAnalysis?: string;
}
