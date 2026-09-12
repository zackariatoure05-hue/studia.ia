"use client";
import { Mic, Sparkles, FileText, BrainCircuit } from "lucide-react";

export default function AnimatedHeroMockup() {
  return (
    <div className="w-full aspect-video bg-slate-900 rounded-2xl md:rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-indigo-900/20 flex border border-slate-700/50">
      {/* Sidebar */}
      <div className="hidden md:flex w-1/4 h-full bg-slate-800/80 p-6 border-r border-slate-700 flex-col gap-6">
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full" />
        <div className="w-3/4 h-3 bg-slate-700 rounded-full" />
        <div className="w-5/6 h-3 bg-slate-700 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="w-1/3 h-6 bg-slate-700 rounded-full" />
          <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 flex items-center gap-3 animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            <span className="text-blue-400 text-sm font-semibold tracking-wide">
              Enregistrement...
            </span>
          </div>
        </div>

        <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed typing-animation">
            Le professeur explique que la photosynthèse est un processus crucial pour la vie sur
            Terre...
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 h-28 shrink-0">
          <div className="bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center p-5">
            <FileText className="w-8 h-8 text-purple-400 mr-4" />
            <div className="w-1/2 h-3 bg-purple-400/30 rounded-full" />
          </div>
          <div className="bg-pink-500/10 rounded-2xl border border-pink-500/20 flex items-center p-5">
            <BrainCircuit className="w-8 h-8 text-pink-400 mr-4" />
            <div className="w-1/2 h-3 bg-pink-400/30 rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .typing-animation {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing 4s steps(40, end) infinite alternate;
        }
        @keyframes typing {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
