"use client";

import React from "react";
import { useCollection } from "../context/CollectionContext";
import clsx from "clsx";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LabelSelector() {
  const { setSelectedLabel } = useCollection();

  return (
    <div className="w-full h-screen bg-neutral-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Select Label
          </h1>
          <p className="text-neutral-400 text-lg">
            Choose a label to start collecting images for this class
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLabel(letter)}
              className={clsx(
                "aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300",
                "bg-neutral-900 border border-neutral-800 text-neutral-300",
                "hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20",
                "active:scale-95",
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
