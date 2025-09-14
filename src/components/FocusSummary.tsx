"use client";
import React from "react";
import { Eye, Target, Clock, RefreshCw } from "lucide-react";
import { computeMetrics } from "@/lib/focus/metrics";
import { GazePoint } from "@/lib/focus/session";

interface FocusSummaryProps {
  data: GazePoint[];
  start: number;
  end: number;
}

const FocusSummary: React.FC<FocusSummaryProps> = ({ data, start, end }) => {
  const metrics = computeMetrics(data, start, end);

  const CircularProgress = ({ percentage, size = 180 }: { percentage: number; size?: number }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getProgressColor = (percentage: number) => {
      if (percentage >= 80) return "rgb(34, 197, 94)";
      if (percentage >= 50) return "rgb(234, 179, 8)";
      return "rgb(239, 68, 68)";
    };

    const progressColor = getProgressColor(percentage);

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(229, 231, 235)"
            strokeWidth="8"
            fill="none"
          />
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

  const MetricItem = ({
    icon: Icon,
    label,
    value,
    unit = "",
    color = "blue",
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    unit?: string;
    color?: "blue" | "green" | "yellow" | "purple";
  }) => {
    const colorClasses: Record<string, string> = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600",
      purple: "from-purple-500 to-purple-600",
    };

    return (
      <div className="group relative overflow-hidden bg-gradient-to-br from-base-100 to-base-200 rounded-xl p-4 border border-base-300 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        ></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                {label}
              </h4>
              <p className="text-xs text-base-content/60">Performance metric</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
            >
              {value}
              {unit}
            </div>
            <div className="text-xs text-base-content/50 mt-1">Current</div>
          </div>
        </div>
      </div>
    );
  };

  const HeatMap = () => (
    <div className="bg-base-200 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-4">
        <div className="w-full h-full opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full gap-1">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="bg-base-300 rounded-sm"></div>
            ))}
          </div>
        </div>
        {metrics.contentEngagement.map((cell, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 70 + 15}%`,
              backgroundColor: `hsl(var(--p) / 0.6)`,
            }}
          />
        ))}
      </div>
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
          <p className="text-base-content/70">{metrics.sessionSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body items-center text-center">
              <CircularProgress percentage={metrics.focusScore} />
              <h3 className="text-xl font-bold text-gray-800 mt-4">
                Focus Score
              </h3>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body space-y-4">
              <MetricItem
                icon={Eye}
                label="Attention Stability"
                value={metrics.attentionStability}
                color="blue"
              />
              <MetricItem
                icon={Target}
                label="Peak Focus Window"
                value={metrics.peakFocusWindow}
                color="green"
              />
              <MetricItem
                icon={Clock}
                label="Distraction Recovery"
                value={metrics.distractionRecovery}
                color="yellow"
              />
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Your Heat Map</h3>
              <HeatMap />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Content Engagement</h3>
              <ul className="list-disc pl-6 text-base-content">
                {metrics.contentEngagement.map((cell, i) => (
                  <li key={i}>{cell}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusSummary;
