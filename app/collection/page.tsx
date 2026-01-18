"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CollectionPage() {
  const [selectedLetter, setSelectedLetter] = useState("A");

  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col font-sans p-6 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors border border-neutral-700"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Collection</h1>
        </div>

        {/* Filter Bar */}
        <div className="w-full overflow-x-auto p-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${
                    selectedLetter === letter
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-neutral-700"
                  }
                `}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="flex-1 rounded-2xl bg-neutral-800/50 border border-neutral-700 p-8 flex items-center justify-center text-neutral-500">
          <p>Displaying items for filter: {selectedLetter}</p>
        </div>
      </div>
    </main>
  );
}
