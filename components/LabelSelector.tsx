"use client";

import React from "react";
import { useCollection } from "../context/CollectionContext";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface CollectionCount {
  letter: string;
  count: number;
}

export default function LabelSelector() {
  const { setSelectedLabel } = useCollection();

  const { data: counts } = useQuery<CollectionCount[]>({
    queryKey: ["collection-counts"],
    queryFn: async () => {
      const response = await axios.get("/api/collection/count");
      return response.data;
    },
  });

  const getCountForLetter = (letter: string) => {
    return counts?.find((c) => c.letter === letter)?.count ?? 0;
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full text-center space-y-6 md:space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Pilih Abjad
          </h1>
          <p className="text-neutral-400 text-lg">
            Pilih abjad untuk mulai mengambil dataset, kumpulkan minimal 150
            gambar untuk setiap huruf.
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
          {ALPHABET.map((letter) => {
            const count = getCountForLetter(letter);
            const progress = Math.min(100, (count / 150) * 100);
            const isCompleted = count >= 150;

            return (
              <button
                key={letter}
                data-testid={`label-button-${letter}`}
                onClick={() => setSelectedLabel(letter)}
                className={clsx(
                  "aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group",
                  "bg-neutral-900 border text-neutral-300",
                  isCompleted
                    ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                    : "border-neutral-800",
                  "hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20",
                  "active:scale-95",
                )}
              >
                {/* Progress Fill Layer */}
                <div
                  className={clsx(
                    "absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out",
                    isCompleted ? "bg-orange-500/30" : "bg-orange-500/20",
                    "group-hover:bg-orange-500/40",
                  )}
                  style={{ height: `${progress}%` }}
                />

                <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:scale-110">
                  <span
                    className={clsx(
                      "text-2xl font-bold transition-colors duration-300",
                      isCompleted
                        ? "text-orange-400"
                        : "group-hover:text-white",
                    )}
                  >
                    {letter}
                  </span>
                  <span className="text-[10px] mt-1 opacity-60 font-medium group-hover:opacity-100 transition-opacity">
                    {count} gambar
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
