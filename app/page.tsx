"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import WebcamCapture from "../components/WebcamCapture";
import ImageGallery from "../components/ImageGallery";
import LabelSelector from "../components/LabelSelector";
import {
  CollectionProvider,
  useCollection,
} from "../context/CollectionContext";

function CollectionPageContent() {
  const webcamRef = useRef<Webcam>(null);
  const { isCapturing, setCountdown, addCapturedImage, selectedLabel } =
    useCollection();

  // Capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && selectedLabel) {
      addCapturedImage({
        id: crypto.randomUUID(),
        url: imageSrc,
        timestamp: new Date(),
        label: selectedLabel,
      });
    }
  }, [webcamRef, addCapturedImage, selectedLabel]);

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
  }, [isCapturing, capture, setCountdown]);

  if (!selectedLabel) {
    return <LabelSelector />;
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col md:flex-row overflow-hidden font-sans">
      <WebcamCapture ref={webcamRef} />
      <ImageGallery />
    </main>
  );
}

export default function Home() {
  return (
    <CollectionProvider>
      <CollectionPageContent />
    </CollectionProvider>
  );
}
