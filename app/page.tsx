import Link from "next/link";
import { ArrowRight, Database, Camera } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center font-sans p-6 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-2xl gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Dataset Collection Tool
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Dataset Gather
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Effortless image collection for your machine learning datasets.
            Capture, label, and manage with ease.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            href="/collect"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            <Camera className="w-5 h-5" />
            Start Collecting
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/collect"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition-all border border-neutral-700 hover:border-neutral-600"
          >
            <Database className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
            See Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
