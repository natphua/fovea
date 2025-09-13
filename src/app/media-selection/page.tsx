"use client";

import { useState } from "react";
import { useFocusSession } from "@/hooks/useFocusSession"; // adjust path
import WebGazerComponent from "@/components/WebGazer";

export default function StartSessionPage() {
  const { startSession, endSession, session } = useFocusSession();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  // handle YouTube input
  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = youtubeUrl.match(/v=([^&]+)/);
    if (match) {
      setEmbedUrl(`https://www.youtube.com/embed/${match[1]}`);
      startSession();
    }
  };

  // handle file uploads (pdf or mov)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setEmbedUrl(url); // show it
    startSession();
  };

  return (
    <section className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Start a Focus Session</h1>

      {/* Upload or Paste */}
      <div className="card bg-base-100 shadow-xl p-6 mb-6 max-w-xl mx-auto">
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

      {/* Session Viewer */}
      {embedUrl && (
        <div className="relative max-w-5xl mx-auto">
          {embedUrl.includes("youtube.com") ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="500"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          ) : embedUrl.endsWith(".pdf") ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="600"
              className="rounded-lg shadow-lg"
            />
          ) : embedUrl.endsWith(".mov") ? (
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
      {session && embedUrl && (
        <div className="text-center mt-6">
          <button onClick={endSession} className="btn btn-secondary">
            End Session
          </button>
        </div>
      )}
    </section>
  );
}
