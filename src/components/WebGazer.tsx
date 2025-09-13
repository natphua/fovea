"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    webgazer: any;
  }
}

export default function WebGazerComponent() {
  useEffect(() => {
    const requestCamera = async () => {
      try {
        // Ask for webcam access first
        await navigator.mediaDevices.getUserMedia({ video: true });

        // Now load WebGazer only after permission granted
        const script = document.createElement("script");
        script.src = "https://webgazer.cs.brown.edu/webgazer.js";
        script.async = true;
        script.onload = () => {
          const check = setInterval(() => {
            if (window.webgazer) {
              clearInterval(check);
              window.webgazer
                .showVideo(true) // show webcam feed (optional)
                .showPredictionPoints(true) // show dots (optional)
                .setGazeListener((data: any, elapsedTime: number) => {
                  if (data) {
                    console.log("Gaze:", data.x, data.y);
                  }
                })
                .begin();
            }
          }, 100);
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    requestCamera();

    return () => {
      if (window.webgazer) {
        window.webgazer.end();
      }
    };
  }, []);

  return <div>WebGazer is requesting camera access...</div>;
}
