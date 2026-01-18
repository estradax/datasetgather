"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import WebcamCapture from "../components/WebcamCapture";
import ImageGallery from "../components/ImageGallery";
import LabelSelector from "../components/LabelSelector";
import {
  CollectionProvider,
  useCollection,
} from "../context/CollectionContext";

function CollectionPageContent() {
  const webcamRef = useRef<Webcam>(null);
  const {
    isCapturing,
    setCountdown,
    addCapturedImage,
    updateImageStatus,
    selectedLabel,
  } = useCollection();

  // Mutation for uploading image
  const { mutate: uploadImage } = useMutation({
    mutationFn: async ({ file, label }: { file: File; label: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", label);

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });

  // Capture function
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && selectedLabel) {
      const id = crypto.randomUUID();

      // Convert base64 to blob
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

      addCapturedImage({
        id,
        url: imageSrc,
        timestamp: new Date(),
        label: selectedLabel,
        status: "uploading",
      });

      uploadImage(
        { file, label: selectedLabel },
        {
          onSuccess: () => {
            updateImageStatus(id, "success");
          },
          onError: () => {
            updateImageStatus(id, "error");
          },
        },
      );
    }
  }, [
    webcamRef,
    addCapturedImage,
    selectedLabel,
    uploadImage,
    updateImageStatus,
  ]);

  // Interval logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isCapturing) {
      // Initial countdown reset only if it's null (not active)
      setCountdown((prev) => (prev === null ? 3 : prev));

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
