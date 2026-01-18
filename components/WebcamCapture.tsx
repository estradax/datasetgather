"use client";

import React, { forwardRef } from "react";
import Webcam from "react-webcam";
import { Camera, Square, Play, X } from "lucide-react";
import clsx from "clsx";
import { useCollection } from "../context/CollectionContext";

const WebcamCapture = forwardRef<Webcam>((_, ref) => {
  const {
    isCapturing,
    setIsCapturing,
    countdown,
    selectedLabel,
    setSelectedLabel,
  } = useCollection();

  const toggleCapture = () => {
    setIsCapturing(!isCapturing);
  };

  return (
    <div className="md:w-1/2 w-full h-1/2 md:h-screen relative flex flex-col border-r border-neutral-800">
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-10 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Camera className="w-5 h-5 md:w-6 md:h-6" />
            Dataset Gatherer
          </h1>
          <p className="text-neutral-400 text-[10px] md:text-sm mt-0.5 md:mt-1">
            {selectedLabel
              ? `Collecting for Class: ${selectedLabel}`
              : "Automatic web dataset collection tool"}
          </p>
        </div>

        {selectedLabel && (
          <button
            onClick={() => {
              setIsCapturing(false);
              setSelectedLabel(null);
            }}
            className="px-2 md:px-3 py-1 md:py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[10px] md:text-xs font-medium text-neutral-300 transition-colors flex items-center gap-1.5 md:gap-2"
          >
            Change Label
            <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
          </button>
        )}
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
        <div className="absolute top-20 md:top-24 left-4 md:left-6 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-1.5 md:gap-2">
          <div
            className={clsx(
              "w-1.5 md:w-2 h-1.5 md:h-2 rounded-full",
              isCapturing ? "bg-red-500 animate-pulse" : "bg-neutral-500",
            )}
          ></div>
          <span className="text-[10px] md:text-xs font-medium text-white">
            {isCapturing ? "RECORDING" : "IDLE"}
          </span>
        </div>

        {/* Label Badge */}
        {selectedLabel && (
          <div className="absolute top-20 md:top-24 right-4 md:right-6 px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/50 flex items-center gap-1.5 md:gap-2">
            <span className="text-[10px] md:text-xs font-bold text-orange-500">
              LABEL: {selectedLabel}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/90 to-transparent flex justify-center items-center gap-4 md:gap-6">
        <button
          onClick={toggleCapture}
          className={clsx(
            "rounded-full p-3 md:p-4 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 md:gap-3 font-semibold px-6 md:px-8 text-sm md:text-base",
            isCapturing
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-2 border-red-500/50"
              : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 hover:shadow-orange-500/40",
          )}
        >
          {isCapturing ? (
            <>
              <Square className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              Stop Collection
            </>
          ) : (
            <>
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              Start Collection
            </>
          )}
        </button>
      </div>
    </div>
  );
});

WebcamCapture.displayName = "WebcamCapture";

export default WebcamCapture;
