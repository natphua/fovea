"use client";
import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    webgazer: any;
  }
}

interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
}

export default function WebGazerComponent() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'requesting' | 'granted' | 'denied'>('requesting');
  const [showCalibration, setShowCalibration] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const gazePointsRef = useRef<GazePoint[]>([]);
  const centroidRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Handle calibration point click
  const handleCalibrationClick = (event: React.MouseEvent) => {
    if (window.webgazer && isInitialized) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Add calibration point to WebGazer
      window.webgazer.recordScreenPosition(x, y, 'click');
      console.log('Calibration point added at:', x, y);
      
      // Hide calibration and mark as calibrated
      setTimeout(() => {
        setShowCalibration(false);
        setIsCalibrated(true);
      }, 500);
    }
  };

  // Calculate centroid of points from last 3 seconds
  const calculateCentroid = (points: GazePoint[]): { x: number; y: number } | null => {
    if (points.length < 3) return null;

    const now = Date.now();
    const recentPoints = points.filter(point => now - point.timestamp <= 3000); // 3 seconds

    if (recentPoints.length < 3) return null;

    // Get last 3 points to form triangle
    const lastThree = recentPoints.slice(-3);
    
    const centroidX = (lastThree[0].x + lastThree[1].x + lastThree[2].x) / 3;
    const centroidY = (lastThree[0].y + lastThree[1].y + lastThree[2].y) / 3;

    return { x: centroidX, y: centroidY };
  };

  // Update centroid position smoothly
  const updateCentroid = () => {
    const centroid = calculateCentroid(gazePointsRef.current);
    
    if (centroid && centroidRef.current) {
      centroidRef.current.style.transform = `translate(${centroid.x - 10}px, ${centroid.y - 10}px)`;
      centroidRef.current.style.opacity = '1';
    } else if (centroidRef.current) {
      centroidRef.current.style.opacity = '0';
    }

    animationRef.current = requestAnimationFrame(updateCentroid);
  };

  useEffect(() => {
    const requestCamera = async () => {
      try {
        setCameraStatus('requesting');
        
        // Ask for webcam access first
        await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          } 
        });
        
        setCameraStatus('granted');

        // Now load WebGazer only after permission granted
        const script = document.createElement("script");
        script.src = "https://webgazer.cs.brown.edu/webgazer.js";
        script.async = true;
        script.onload = () => {
          const check = setInterval(() => {
            if (window.webgazer) {
              clearInterval(check);
              
              window.webgazer
                .setRegression('ridge') // Use ridge regression for better accuracy
                .setTracker('clmtrackr') // Use CLM face tracker
                .showVideo(false) // Show webcam feed overlay
                .showPredictionPoints(true) // Show individual prediction points
                .applyKalmanFilter(true) // Apply smoothing filter
                .setGazeListener((data: any, elapsedTime: number) => {
                  if (data && data.x && data.y) {
                    // Store gaze point with timestamp
                    const gazePoint: GazePoint = {
                      x: data.x,
                      y: data.y,
                      timestamp: Date.now()
                    };
                    
                    gazePointsRef.current.push(gazePoint);
                    
                    // Keep only last 5 seconds of data to prevent memory buildup
                    const fiveSecondsAgo = Date.now() - 5000;
                    gazePointsRef.current = gazePointsRef.current.filter(
                      point => point.timestamp > fiveSecondsAgo
                    );

                    console.log("Gaze:", data.x, data.y, "Points stored:", gazePointsRef.current.length);
                  }
                })
                .begin()
                .then(() => {
                  setIsInitialized(true);
                  // Show calibration point immediately after initialization
                  setShowCalibration(true);
                  // Start centroid animation loop
                  updateCentroid();
                })
                .catch((err: any) => {
                  console.error("WebGazer initialization failed:", err);
                  setCameraStatus('denied');
                });
            }
          }, 1000);
        };
        
        script.onerror = () => {
          console.error("Failed to load WebGazer script");
          setCameraStatus('denied');
        };
        
        document.head.appendChild(script);
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraStatus('denied');
      }
    };

    requestCamera();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (window.webgazer) {
        window.webgazer.end();
      }
    };
  }, []);

  return (
    <>
      {/* Status indicator */}
      <div className="fixed top-4 right-4 z-50">
        {cameraStatus === 'requesting' && (
          <div className="alert alert-info shadow-lg max-w-xs">
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-sm"></span>
              <div>
                <h3 className="font-bold text-sm">Camera Access</h3>
                <div className="text-xs opacity-75">Requesting permission...</div>
              </div>
            </div>
          </div>
        )}
        
        {cameraStatus === 'granted' && !isInitialized && (
          <div className="alert alert-warning shadow-lg max-w-xs">
            <div className="flex items-center gap-3">
              <span className="loading loading-dots loading-sm"></span>
              <div>
                <h3 className="font-bold text-sm">Initializing</h3>
                <div className="text-xs opacity-75">Loading eye tracking...</div>
              </div>
            </div>
          </div>
        )}
        
        {cameraStatus === 'granted' && isInitialized && !isCalibrated && (
          <div className="alert alert-warning shadow-lg max-w-xs">
            <div className="flex items-center gap-3">
              <span className="loading loading-dots loading-sm"></span>
              <div>
                <h3 className="font-bold text-sm">Calibration Required</h3>
                <div className="text-xs opacity-75">Please complete calibration...</div>
              </div>
            </div>
          </div>
        )}
        
        {cameraStatus === 'granted' && isInitialized && isCalibrated && (
          <div className="alert alert-success shadow-lg max-w-xs">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <h3 className="font-bold text-sm">Eye Tracking Active</h3>
                <div className="text-xs opacity-75">Centroid prediction enabled</div>
              </div>
            </div>
          </div>
        )}
        
        {cameraStatus === 'denied' && (
          <div className="alert alert-error shadow-lg max-w-xs">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <h3 className="font-bold text-sm">Camera Denied</h3>
                <div className="text-xs opacity-75">Please enable camera access</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Centroid prediction point */}
      <div
        ref={centroidRef}
        className="fixed pointer-events-none z-40 transition-opacity duration-300"
        style={{
          width: '20px',
          height: '20px',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      >
        {/* Centroid indicator - larger, more prominent */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>

      {/* Center calibration point */}
      {showCalibration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Calibration</h2>
            <p className="mb-6">Look at the center point and click it to calibrate eye tracking</p>
            <div 
              className="w-12 h-12 bg-red-500 rounded-full mx-auto cursor-pointer relative animate-pulse hover:bg-red-400 transition-colors"
              onClick={handleCalibrationClick}
            >
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-full h-full bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calibration instructions overlay */}
      {isCalibrated && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="tooltip tooltip-top" data-tip="Purple dot shows averaged gaze prediction from last 3 points">
            <div className="badge badge-info gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-xs">Purple dot shows averaged gaze prediction</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}