"use client";

import { useState, useRef, useEffect } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WindowWrapper from "@/components/WindowWrapper";
import WindowControls from "@/components/WindowControls";
import Image from "next/image";

interface FaceTimeProps {
  isDarkMode?: boolean;
}

function FaceTime({ isDarkMode = true }: FaceTimeProps) {
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const buttonBg = isDarkMode
    ? "bg-gray-800 hover:bg-gray-700"
    : "bg-gray-100 hover:bg-gray-200";

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Store stream reference for cleanup
      streamRef.current = stream;
      setIsCameraAvailable(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraAvailable(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start camera when component mounts
  useEffect(() => {
    startCamera();

    // Clean up function to ensure camera is turned off when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL and save to state
        const photoUrl = canvas.toDataURL("image/png");
        setCapturedPhotos((prev) => [...prev, photoUrl]);
      }
    }
  };

  const deletePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div id="window-header">
        <WindowControls target="facetime" />
        <h2>Facetime</h2>
      </div>
      <div className={`flex ${bgColor} ${textColor}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
          {isCameraAvailable ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-2xl h-auto rounded-xl dark:bg-black"
            />
          ) : (
            <div className="w-full max-w-2xl aspect-video rounded-xl bg-black flex items-center justify-center">
              <p className="text-white text-center p-4">
                Camera access is not available. Please check your browser
                permissions.
              </p>
            </div>
          )}

          {/* Hidden canvas for capturing photos */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Capture button */}
          {isCameraAvailable && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Button
                className={`w-16 h-16 rounded-full bg-white hover:bg-gray-200 text-black`}
                onClick={capturePhoto}
              >
                <ImageIcon className="w-8 h-8" />
              </Button>
            </div>
          )}
        </div>

        {/* Captured photos gallery */}
        {capturedPhotos.length > 0 && (
          <div
            className={`p-4 border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <h3 className="text-sm font-medium mb-2">Captured Photos</h3>
            <div className="flex flex-col h-100 space-y-3 pb-2 overflow-y-scroll">
              {capturedPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Captured photo ${index + 1}`}
                    className="h-24 w-auto rounded"
                    width={100}
                    height={100}
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deletePhoto(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const FacetimeWindow = WindowWrapper(FaceTime, "facetime");

export default FacetimeWindow;
