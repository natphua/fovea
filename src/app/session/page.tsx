"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useFocusSession } from "@/hooks/useFocusSession";
import { useAuth } from "@/contexts/AuthContext";
import NavBar from "@/components/NavBar";

// WebGazer only on client
const WebGazerComponent = dynamic(
  () => import("@/components/WebGazer"),
  { ssr: false }
);

export default function StartSessionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    startSession,
    handleEndSession,
    pauseSession,
    resumeSession,
    isPaused,
  } = useFocusSession();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } 
  }, [user, loading, router]);

  // Timer effect - pause when session is paused
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isPaused]);

  // Check for existing file protocol from dashboard
  useEffect(() => {
    const initializeFromSavedProtocol = async () => {
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
            
            // Start session FIRST, then set hasStarted to trigger WebGazer
            await startSession(savedFileProtocol);
            setHasStarted(true);
          }
        } else {
          // It's a file name - we can't recreate the file object, so just show a message
          alert(`Ready to start session with: ${savedFileProtocol}\nPlease upload the file again to continue.`);
        }
      }
    };

    initializeFromSavedProtocol();
  }, [startSession]);

  // YouTube embed
  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const match = youtubeUrl.match(/v=([^&]+)/);
    if (match) {
      const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
      setEmbedUrl(embedUrl);
      
      // Start session FIRST, then set hasStarted to trigger WebGazer
      await startSession(youtubeUrl);
      setHasStarted(true);
    }
  };

  // File upload (PDF or MOV)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    const url = URL.createObjectURL(file);
    setEmbedUrl(url);
    
    // Start session FIRST, then set hasStarted to trigger WebGazer
    await startSession(file.name);
    setHasStarted(true);
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Before Session - Original Form Layout */}
      {!hasStarted && (
        <>
        <NavBar />
        <section className="min-h-screen px-6 py-30 flex flex-col items-center relative">
          <h1 className="text-3xl font-bold mb-6 text-center">Start a Focus Session</h1>

          {/* Upload UI */}
          <div className="transition-opacity duration-700 opacity-100">
            <div className="card bg-base-100 shadow-xl p-6 mb-6 max-w-7xl">
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
        </>
      )}

      {/* After Session Starts - 30/70 Split Layout */}
      {hasStarted && (
        <div className="h-screen p-6">
          <div className="h-full flex gap-4">
            {/* Left Control Panel */}
            <div className="w-[20%] bg-black flex flex-col p-6 rounded-xl self-start min-h-fit">
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
                <div className="bg-gray-800 rounded-xl p-4 border border-green-500/50">
                  <div className="text-center">
                    <div className="text-3xl font-mono text-green-400 font-bold">
                      {formatTime(elapsedTime)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pause/Resume Button */}
              <div className="mt-6">
                <button
                  onClick={isPaused ? resumeSession : pauseSession}
                  className={`w-full font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-4 ${
                    isPaused 
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                  }`}
                >
                  {isPaused ? "▶️ Resume Session" : "⏸️ Pause Session"}
                </button>
              </div>

              {/* End Session Button */}
              <div className="mt-2">
                <button
                  onClick={() => {
                    handleEndSession();
                    setHasStarted(false);
                    setEmbedUrl("");
                    setPdfFile(null);
                    setYoutubeUrl("");
                    setElapsedTime(0);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  End Session
                </button>
              </div>
            </div>

            {/* Right Media Viewer - 70% */}
            <div className="w-[80%] bg-black relative rounded-xl overflow-hidden">
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