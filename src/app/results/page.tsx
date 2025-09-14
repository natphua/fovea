"use client";

import { useEffect, useState } from "react";
import FocusSummary from "@/components/FocusSummary";
import { FocusSession } from "@/lib/focus/session";

export default function ResultsPage() {
  const [session, setSession] = useState<FocusSession | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastSession");
    if (stored) {
      setSession(JSON.parse(stored));
    }
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        No session data found. Start a focus session first.
      </div>
    );
  }

  return (
    <FocusSummary
      data={session.gazeData}
      start={session.startTime}
      end={session.endTime}
    />
  );
}
