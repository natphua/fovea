import React from 'react';
import { Eye, Target, Clock, RefreshCw } from 'lucide-react';

const FocusSummary = () => {
  // Mock data - in real app this would come from your useFocusSession hook
  const mockSession = {
    focusScore: 84,
    metrics: {
      eyesOnScreen: 92,
      timeToFirstFixation: 0.8,
      blinkRate: 12,
      revisits: 8
    },
    heatMapData: [], // Would contain actual gaze points
    previousSessions: [
      { date: '9/10/25', score: 78 },
      { date: '9/09/25', score: 82 },
      { date: '9/08/25', score: 71 }
    ],
    aiSummary: {
      whatYouLearned: "Your focus patterns show strong engagement with visual content, particularly in the upper-left quadrant of the screen.",
      whatYouMissed: "There were several instances of attention drift during the middle section, suggesting potential fatigue."
    }
  };

  const CircularProgress = ({ percentage, size = 180 }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--bc) / 0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--p))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{percentage}%</span>
        </div>
      </div>
    );
  };

  const MetricItem = ({ icon: Icon, label, value, unit = '' }) => (
    <div className="flex items-center justify-between py-3 border-b border-base-300 last:border-b-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}{unit}</span>
    </div>
  );

  const HeatMap = () => (
    <div className="bg-base-200 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
      {/* Simulated heat map visualization */}
      <div className="absolute inset-4">
        {/* Grid background */}
        <div className="w-full h-full opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full gap-1">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="bg-base-300 rounded-sm"></div>
            ))}
          </div>
        </div>
        
        {/* Heat spots */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 70 + 15}%`,
              backgroundColor: `hsl(var(--p) / ${0.3 + Math.random() * 0.7})`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <button className="btn btn-sm btn-outline absolute bottom-4 right-4">
        Show only Areas of Interest (AOI)
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Eye className="w-5 h-5 text-primary-content" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Focus Summary</h1>
          <p className="text-base-content/70">MacBook Air - 1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Focus Score & Metrics */}
        <div className="space-y-6">
          {/* Focus Score Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body items-center text-center">
              <CircularProgress percentage={mockSession.focusScore} />
            </div>
          </div>

          {/* Metrics Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Session Metrics</h3>
              <div className="space-y-1">
                <MetricItem 
                  icon={Eye} 
                  label="Eyes on Screen" 
                  value={mockSession.metrics.eyesOnScreen} 
                  unit="%" 
                />
                <MetricItem 
                  icon={Target} 
                  label="Time to First Fixation (TTFF)" 
                  value={mockSession.metrics.timeToFirstFixation} 
                  unit="s" 
                />
                <MetricItem 
                  icon={Clock} 
                  label="Blink Rate" 
                  value={mockSession.metrics.blinkRate} 
                  unit="/min" 
                />
                <MetricItem 
                  icon={RefreshCw} 
                  label="Revisits" 
                  value={mockSession.metrics.revisits} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - AI Summary & Heat Map */}
        <div className="space-y-6">
          {/* AI Summary Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">AI Summary of Focus Session</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-primary mb-2 border-b border-primary pb-1">
                    What You Learned
                  </h4>
                  <div className="bg-base-200 p-3 rounded-lg">
                    <p className="text-sm text-base-content/80">
                      {mockSession.aiSummary.whatYouLearned}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-secondary mb-2 border-b border-secondary pb-1">
                    What You Missed
                  </h4>
                  <div className="bg-base-200 p-3 rounded-lg">
                    <p className="text-sm text-base-content/80">
                      {mockSession.aiSummary.whatYouMissed}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heat Map Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Your Heat Map</h3>
              <HeatMap />
            </div>
          </div>
        </div>

        {/* Right Column - Previous Sessions */}
        <div>
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Previous Focus Sessions</h3>
              
              <div className="space-y-3">
                {mockSession.previousSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">{session.date}</span>
                    <div className="badge badge-primary badge-lg">
                      {session.score}%
                    </div>
                  </div>
                ))}
                
                {/* Placeholder sessions */}
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg opacity-50">
                  <span className="text-sm">9/07/25</span>
                  <div className="badge badge-ghost">--</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg opacity-50">
                  <span className="text-sm">9/06/25</span>
                  <div className="badge badge-ghost">--</div>
                </div>
              </div>

              <div className="mt-6">
                <button className="btn btn-outline btn-sm w-full">
                  View All Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button className="btn btn-primary btn-lg">
          Start New Session
        </button>
        <button className="btn btn-outline btn-lg">
          Export Data
        </button>
      </div>
    </div>
  );
};

export default FocusSummary;