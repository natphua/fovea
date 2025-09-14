"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useFocusSession } from "@/hooks/useFocusSession"; // adjust path

// WebGazer only on client
const WebGazerComponent = dynamic(
  () => import("@/components/WebGazer"),
  { ssr: false }
);

// PDF viewer only on client (avoids pdfjs Node canvas error)
const PDFViewer = dynamic(
  () => import("@react-pdf-viewer/core").then((mod) => mod.Worker),
  { ssr: false }
);

export default function StartSessionPage() {
  const { startSession, endSession, session } = useFocusSession();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted]);

  // YouTube embed
  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = youtubeUrl.match(/v=([^&]+)/);
    if (match) {
      setEmbedUrl(`https://www.youtube.com/embed/${match[1]}`);
      setHasStarted(true);
      startSession();
    }
  };

  // File upload (PDF or MOV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    const url = URL.createObjectURL(file);
    setEmbedUrl(url);
    setHasStarted(true);
    startSession();
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="min-h-screen p-6 flex flex-col items-center relative">
      {/* Sticky Elapsed Time */}
      {hasStarted && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-xl px-4 py-2 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm font-semibold">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">
        {hasStarted ? (
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Focus Session in Progress
          </span>
        ) : (
          "Start a Focus Session"
        )}
      </h1>

      {/* Upload UI */}
      {!hasStarted && (
        <div className="transition-opacity duration-700 opacity-100">
          <div className="card bg-base-100 shadow-xl p-6 mb-6 max-w-2xl">
            <form onSubmit={handleYoutubeSubmit} className="mb-4">
              <label className="block mb-2 font-medium">Paste YouTube Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="input input-bordered flex-1"
                />
                <button type="submit" className="btn btn-primary">Load</button>
              </div>
            </form>

            <div className="divider">OR</div>

            <div>
              <label className="block mb-2 font-medium">Upload PDF or .mov</label>
              <input
                type="file"
                accept=".pdf,.mov"
                onChange={handleFileUpload}
                className="file-input file-input-bordered w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Session Status Bar */}
      {hasStarted && (
        <div className="w-full max-w-4xl mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-5 h-5 bg-green-400 rounded-full animate-pulse shadow-xl shadow-green-400/80" style={{ animationDuration: '2s', animationDelay: '0s' }}></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '2s', animationDelay: '0s' }}>Begin reading when ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Media Viewer */}
      {hasStarted && embedUrl && (
        <div className="relative max-w-7xl w-full h-screen transition-opacity duration-700 opacity-100">
          {embedUrl.includes("youtube.com") ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          ) : pdfFile?.type === "application/pdf" ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              className="rounded-lg shadow-lg"
            />
          ) : pdfFile?.type === "video/quicktime" || pdfFile?.name.endsWith(".mov") ? (
            <video
              src={embedUrl}
              width="100%"
              height="500"
              controls
              className="rounded-lg shadow-lg"
            />
          ) : null}

          {/* WebGazer overlay */}
          <WebGazerComponent />
        </div>
      )}

      {/* End Session */}
      {hasStarted && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              endSession();
              setHasStarted(false);
              setEmbedUrl("");
              setPdfFile(null);
              setYoutubeUrl("");
            }}
            className="btn btn-secondary"
          >
            End Session
          </button>
        </div>
      )}
    </section>
  );
}