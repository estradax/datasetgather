"use client";

import React, { forwardRef } from "react";
import Webcam from "react-webcam";
import { Camera, Square, Play } from "lucide-react";
import clsx from "clsx";

interface WebcamCaptureProps {
  isCapturing: boolean;
  countdown: number | null;
  onToggleCapture: () => void;
}

const WebcamCapture = forwardRef<Webcam, WebcamCaptureProps>(
  ({ isCapturing, countdown, onToggleCapture }, ref) => {
    return (
      <div className="md:w-1/2 w-full h-1/2 md:h-screen relative flex flex-col border-r border-neutral-800">
        <div className="absolute top-0 left-0 right-0 p-6 z-10 bg-gradient-to-b from-black/70 to-transparent">
          <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Dataset Gatherer
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Automatic web dataset collection tool
          </p>
        </div>

        <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden group">
          <div className="relative w-full h-full flex items-center justify-center">
            <Webcam
              audio={false}
              ref={ref}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                facingMode: "user",
              }}
              mirrored={true}
            />
          </div>

          {/* Countdown Overlay */}
          {isCapturing && countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]">
              <div
                key={countdown} // Key change triggers animation
                className="text-9xl font-black text-white/90 drop-shadow-2xl animate-pulse"
              >
                {countdown}
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-24 left-6 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-2">
            <div
              className={clsx(
                "w-2 h-2 rounded-full",
                isCapturing ? "bg-red-500 animate-pulse" : "bg-neutral-500",
              )}
            ></div>
            <span className="text-xs font-medium text-white">
              {isCapturing ? "RECORDING" : "IDLE"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent flex justify-center items-center gap-6">
          <button
            onClick={onToggleCapture}
            className={clsx(
              "rounded-full p-4 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3 font-semibold px-8",
              isCapturing
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-2 border-red-500/50"
                : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 hover:shadow-orange-500/40",
            )}
          >
            {isCapturing ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                Stop Collection
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Start Collection
              </>
            )}
          </button>
        </div>
      </div>
    );
  },
);

WebcamCapture.displayName = "WebcamCapture";

export default WebcamCapture;
