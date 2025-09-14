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
    <>
      {/* Before Session - Original Form Layout */}
      {!hasStarted && (
        <section className="min-h-screen px-6 py-10 flex flex-col items-center relative">
          <h1 className="text-3xl font-bold mb-6 text-center">Start a Focus Session</h1>

          {/* Upload UI */}
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
        </section>
      )}

      {/* After Session Starts - 30/70 Split Layout */}
      {hasStarted && (
        <div className="h-screen p-6">
          <div className="h-full flex gap-4">
            {/* Left Control Panel */}
            <div className="w-[30%] bg-black flex flex-col p-6 rounded-xl self-start min-h-fit">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h1 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                      Session Active
                    </span>
                  </h1>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Elapsed Time */}
              <div className="mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-green-500/30">
                  <div className="text-center">
                    <div className="text-3xl font-mono text-green-400 font-bold">
                      {formatTime(elapsedTime)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* End Session Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    endSession();
                    setHasStarted(false);
                    setEmbedUrl("");
                    setPdfFile(null);
                    setYoutubeUrl("");
                    setElapsedTime(0);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  End Session & View Results
                </button>
              </div>
            </div>

            {/* Right Media Viewer - 70% */}
            <div className="w-[70%] bg-black relative rounded-xl overflow-hidden">
              {embedUrl ? (
                <>
                  {embedUrl.includes("youtube.com") ? (
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="border-0"
                    />
                  ) : pdfFile?.type === "application/pdf" ? (
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      className="border-0"
                    />
                  ) : pdfFile?.type === "video/quicktime" || pdfFile?.name.endsWith(".mov") ? (
                    <video
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      controls
                      className="border-0"
                    />
                  ) : null}

                  {/* WebGazer overlay */}
                  <WebGazerComponent />
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">📺</div>
                    <p className="text-xl">Media will appear here</p>
                    <p className="text-sm mt-2">Upload a file or paste a YouTube link to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}