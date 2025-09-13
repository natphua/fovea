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

    // Determine color based on percentage
    const getProgressColor = (percentage) => {
      if (percentage >= 80) return "rgb(34, 197, 94)"; // Green
      if (percentage >= 50) return "rgb(234, 179, 8)"; // Yellow
      return "rgb(239, 68, 68)"; // Red
    };

    const progressColor = getProgressColor(percentage);

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(229, 231, 235)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
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

  const MetricItem = ({ icon: Icon, label, value, unit = '', color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600', 
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600'
    };

    return (
      <div className="group relative overflow-hidden bg-gradient-to-br from-base-100 to-base-200 rounded-xl p-4 border border-base-300 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        {/* Background gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon with gradient background */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Label */}
            <div>
              <h4 className="font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                {label}
              </h4>
              <p className="text-xs text-base-content/60">Performance metric</p>
            </div>
          </div>
          
          {/* Value with enhanced styling */}
          <div className="text-right">
            <div className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
              {value}{unit}
            </div>
            <div className="text-xs text-base-content/50 mt-1">Current</div>
          </div>
        </div>
        
        {/* Progress bar indicator */}
        <div className="mt-3 h-1 bg-base-300 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

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
          <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="card-body items-center text-center">
              <CircularProgress percentage={mockSession.focusScore} />
              <h3 className="text-xl font-bold text-gray-800 mt-4">Focus Score</h3>
              <p className="text-gray-600 text-sm mt-2">Overall performance rating</p>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="card-title text-lg">Session Metrics</h3>
              </div>
              
              <div className="space-y-4">
                <MetricItem 
                  icon={Eye} 
                  label="Eyes on Screen" 
                  value={mockSession.metrics.eyesOnScreen} 
                  unit="%" 
                  color="blue"
                />
                <MetricItem 
                  icon={Target} 
                  label="Time to First Fixation" 
                  value={mockSession.metrics.timeToFirstFixation} 
                  unit="s" 
                  color="green"
                />
                <MetricItem 
                  icon={Clock} 
                  label="Blink Rate" 
                  value={mockSession.metrics.blinkRate} 
                  unit="/min" 
                  color="yellow"
                />
                <MetricItem 
                  icon={RefreshCw} 
                  label="Revisits" 
                  value={mockSession.metrics.revisits} 
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - AI Summary & Heat Map */}
        <div className="space-y-6">
          {/* AI Summary Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="card-title text-lg">AI Summary of Focus Session</h3>
              </div>
              
              <div className="space-y-6">
                {/* What You Learned Section */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
                    <h4 className="text-lg font-bold text-green-600">What You Learned</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-base-content leading-relaxed">
                          {mockSession.aiSummary.whatYouLearned}
                        </p>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full opacity-40"></div>
                  </div>
                </div>
                
                {/* What You Missed Section */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-sm"></div>
                    <h4 className="text-lg font-bold text-orange-600">Areas for Improvement</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-5 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-base-content leading-relaxed">
                          {mockSession.aiSummary.whatYouMissed}
                        </p>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full opacity-60"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-400 rounded-full opacity-40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heat Map Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Your Heat Map</h3>
              <HeatMap />
            </div>
          </div>
        </div>

        {/* Right Column - Previous Sessions */}
        <div>
          <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="card-title text-lg">Previous Focus Sessions</h3>
              </div>
              
              <div className="space-y-3">
                {mockSession.previousSessions.map((session, index) => {
                  // Determine container background gradient based on percentage
                  const getContainerColor = (score) => {
                    if (score >= 80) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100'; // Green gradient
                    if (score >= 50) return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100'; // Yellow gradient
                    return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100'; // Red gradient
                  };

                  // Determine badge color based on percentage (same as container colors)
                  const getBadgeColor = (score) => {
                    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'; // Green badge
                    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'; // Yellow badge
                    return 'bg-gradient-to-r from-red-500 to-pink-500 text-white'; // Red badge
                  };

                  return (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${getContainerColor(session.score)}`}>
                      <span className="text-sm font-medium">{session.date}</span>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getBadgeColor(session.score)}`}>
                        {session.score}%
                      </div>
                    </div>
                  );
                })}
                
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
      <div className="flex justify-center gap-6 mt-12">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 hover:cursor-pointer">
          <Eye className="w-5 h-5" />
          Start New Session
        </button>
        <button className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          Export Data
        </button>
      </div>
    </div>
  );
};

export default FocusSummary;