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
            Select Label
          </h1>
          <p className="text-neutral-400 text-lg">
            Choose a label to start collecting images for this class
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
          {ALPHABET.map((letter) => {
            const count = getCountForLetter(letter);
            return (
              <button
                key={letter}
                onClick={() => setSelectedLabel(letter)}
                className={clsx(
                  "aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300",
                  "bg-neutral-900 border border-neutral-800 text-neutral-300",
                  "hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20",
                  "active:scale-95",
                )}
              >
                <span className="text-2xl font-bold">{letter}</span>
                <span className="text-[10px] mt-1 opacity-60 font-medium">
                  {count} image{count !== 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
