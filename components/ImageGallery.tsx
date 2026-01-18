"use client";

import React from "react";
import {
  Camera,
  Image as ImageIcon,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCollection } from "../context/CollectionContext";

export default function ImageGallery() {
  const { capturedImages, clearImages } = useCollection();

  return (
    <div className="md:w-1/2 w-full h-1/2 md:h-screen bg-neutral-950 flex flex-col border-t md:border-t-0 border-neutral-800">
      <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-950 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-900 rounded-lg">
            <ImageIcon className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Captured Images</h2>
            <p className="text-neutral-500 text-xs">
              {capturedImages.length} items collected
            </p>
          </div>
        </div>
        {capturedImages.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all images?")) {
                clearImages();
              }
            }}
            className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {capturedImages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-600 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800 border-dashed">
              <Camera className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm">No images captured yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {capturedImages.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-orange-500/50 transition-all"
              >
                <img
                  src={img.url}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-900/50 px-1.5 py-0.5 rounded w-fit">
                    {img.label}
                  </span>
                  <span className="text-[10px] font-mono text-white/70">
                    {img.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {/* Upload Status Overlay */}
                {img.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  </div>
                )}

                {img.status === "error" && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
