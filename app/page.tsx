"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import WebcamCapture from "../components/WebcamCapture";
import ImageGallery from "../components/ImageGallery";

interface CapturedImage {
  id: string;
  url: string;
  timestamp: Date;
}

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);

  // Capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => [
        {
          id: crypto.randomUUID(),
          url: imageSrc,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
  }, [webcamRef]);

  // Interval logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isCapturing) {
      // Initial countdown reset
      setCountdown(3);

      // Main interval loop for 3 seconds per capture
      interval = setInterval(() => {
        capture();
        setCountdown(3); // Reset countdown after capture
      }, 3000);

      // Countdown ticker (updates every second)
      countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : 1));
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [isCapturing, capture]);

  const toggleCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const clearImages = () => {
    if (confirm("Are you sure you want to clear all images?")) {
      setCapturedImages([]);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col md:flex-row overflow-hidden font-sans">
      <WebcamCapture
        ref={webcamRef}
        isCapturing={isCapturing}
        countdown={countdown}
        onToggleCapture={toggleCapture}
      />
      <ImageGallery images={capturedImages} onClear={clearImages} />
    </main>
  );
}
