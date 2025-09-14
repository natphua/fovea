// components/ResultsLoadingPage.tsx
"use client";

export default function ResultsLoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-4">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="text-lg font-semibold text-base-content/80">
          Loading Results...
        </p>
      </div>
    </div>
  );
}
