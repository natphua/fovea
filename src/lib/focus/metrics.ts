import { GazePoint, FocusMetrics } from "./session";

export function computeMetrics(data: GazePoint[], start: number, end: number): FocusMetrics {
  const duration = (end - start) / 1000; // total session seconds
  if (data.length === 0) {
    return {
      focusScore: 0,
      sessionSummary: "No gaze data recorded",
      attentionStability: "N/A",
      stabilityGraph: [],
      peakFocusWindow: "N/A",
      distractionRecovery: "N/A",
      contentEngagement: [],
    };
  }

  // 1️⃣ Focus score: % of time gaze stays within main content area
  const mainArea = { xMin: window.innerWidth*0.1, xMax: window.innerWidth*0.9,
                     yMin: window.innerHeight*0.1, yMax: window.innerHeight*0.9 };

  const focusedPoints = data.filter(p => 
    p.x >= mainArea.xMin && p.x <= mainArea.xMax &&
    p.y >= mainArea.yMin && p.y <= mainArea.yMax
  );
  const focusScore = Math.round((focusedPoints.length / data.length) * 100);

  // 2️⃣ Attention Stability: mean displacement between consecutive points
  const deltas: number[] = [];
  for (let i=1; i<data.length; i++) {
    const dx = data[i].x - data[i-1].x;
    const dy = data[i].y - data[i-1].y;
    deltas.push(Math.sqrt(dx*dx + dy*dy));
  }
  const meanDelta = deltas.reduce((a,b)=>a+b,0)/deltas.length || 0;
  let attentionStability: "High" | "Medium" | "Low" = "Medium";
  if (meanDelta < 5) attentionStability = "High";
  else if (meanDelta < 15) attentionStability = "Medium";
  else attentionStability = "Low";

  // 3️⃣ Stability graph: divide session into 5 segments
  const segments = 5;
  const segSize = Math.floor(data.length / segments);
  const stabilityGraph = Array.from({length: segments}, (_, i) => {
    const segPoints = data.slice(i*segSize, (i+1)*segSize);
    const segDeltas: number[] = [];
    for (let j=1; j<segPoints.length; j++) {
      const dx = segPoints[j].x - segPoints[j-1].x;
      const dy = segPoints[j].y - segPoints[j-1].y;
      segDeltas.push(Math.sqrt(dx*dx + dy*dy));
    }
    const mean = segDeltas.reduce((a,b)=>a+b,0)/segDeltas.length || 0;
    return Math.min(1, mean/20); // 0 = stable, 1 = very jittery
  });

  // 4️⃣ Peak focus window: 10s window with most points in main area
  let peakStart = 0;
  let peakCount = 0;
  const windowSize = 10 * 1000; // 10s
  for (let i=0; i<data.length; i++) {
    const t0 = data[i].t;
    const t1 = t0 + windowSize;
    const count = data.filter(p => p.t >= t0 && p.t <= t1 &&
      p.x >= mainArea.xMin && p.x <= mainArea.xMax &&
      p.y >= mainArea.yMin && p.y <= mainArea.yMax
    ).length;
    if (count > peakCount) {
      peakCount = count;
      peakStart = t0;
    }
  }
  const peakFocusWindow = `Seconds ${Math.round(peakStart/1000)}–${Math.round((peakStart+windowSize)/1000)}`;

  // 5️⃣ Distraction recovery: time between leaving main area -> returning
  const recoveryTimes: number[] = [];
  let leftTime: number | null = null;
  for (const p of data) {
    const inMain = p.x >= mainArea.xMin && p.x <= mainArea.xMax &&
                   p.y >= mainArea.yMin && p.y <= mainArea.yMax;
    if (!inMain && leftTime === null) leftTime = p.t;
    if (inMain && leftTime !== null) {
      recoveryTimes.push(p.t - leftTime);
      leftTime = null;
    }
  }
  const distractionRecovery = recoveryTimes.length > 0
    ? `Avg ${(recoveryTimes.reduce((a,b)=>a+b,0)/recoveryTimes.length/1000).toFixed(1)}s to refocus`
    : "No distractions";

  // 6️⃣ Content engagement: divide screen into 3x3 grid
  const engagementMap = new Map<string, number>();
  for (const p of focusedPoints) {
    const col = Math.min(2, Math.floor(p.x / (window.innerWidth / 3)));
    const row = Math.min(2, Math.floor(p.y / (window.innerHeight / 3)));
    const key = `Cell ${row+1}-${col+1}`;
    engagementMap.set(key, (engagementMap.get(key)||0)+1);
  }
  const topCells = Array.from(engagementMap.entries())
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(([key])=>key);

  return {
    focusScore,
    sessionSummary: `You stayed focused for ${Math.round((focusedPoints.length/data.length)*duration/60)} out of ${Math.round(duration/60)} minutes`,
    attentionStability,
    stabilityGraph,
    peakFocusWindow,
    distractionRecovery,
    contentEngagement: topCells,
  };
}
