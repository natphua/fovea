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

  // Check for existing file protocol from dashboard
  useEffect(() => {
    const savedFileProtocol = localStorage.getItem('sessionFileProtocol');
    if (savedFileProtocol) {
      // Clear it from localStorage
      localStorage.removeItem('sessionFileProtocol');
      
      // Check if it's a YouTube URL
      if (savedFileProtocol.includes('youtube.com') || savedFileProtocol.includes('youtu.be')) {
        setYoutubeUrl(savedFileProtocol);
        const match = savedFileProtocol.match(/v=([^&]+)/);
        if (match) {
          setEmbedUrl(`https://www.youtube.com/embed/${match[1]}`);
          setHasStarted(true);
          startSession(savedFileProtocol);
        }
      } else {
        // It's a file name - we can't recreate the file object, so just show a message
        alert(`Ready to start session with: ${savedFileProtocol}\nPlease upload the file again to continue.`);
      }
    }
  }, [startSession]);

  // YouTube embed
  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = youtubeUrl.match(/v=([^&]+)/);
    if (match) {
      const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
      setEmbedUrl(embedUrl);
      setHasStarted(true);
      startSession(youtubeUrl); // Pass the original YouTube URL as file protocol
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
    startSession(file.name); // Pass the file name as file protocol
  };

  return (
    <section className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Start a Focus Session</h1>

      {/* Upload UI */}
      <div
        className={`transition-opacity duration-700 ${
          hasStarted ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
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