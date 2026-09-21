"use client";
import { Sparkles, FileText, ListChecks, Bot } from "lucide-react";

export default function AnimatedFeatureSummary() {
  return (
    <div className="w-full bg-slate-900 flex p-4 sm:p-6 md:p-8 gap-4 md:gap-8 overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[360px] md:min-h-[400px] md:aspect-video">
      {/* Sidebar Summary */}
      <div className="hidden md:flex w-1/3 bg-slate-800/80 rounded-3xl border border-slate-700 p-6 lg:p-8 flex-col gap-6 lg:gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 lg:p-6">
          <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-400 animate-pulse" />
        </div>

        <div
          className="space-y-4 lg:space-y-5 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div className="w-24 h-3 bg-slate-700 rounded-full" />
          </div>
          <div className="w-full h-2.5 bg-slate-600 rounded-full" />
          <div className="w-5/6 h-2.5 bg-slate-600 rounded-full" />
        </div>

        <div
          className="space-y-4 lg:space-y-5 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <ListChecks className="w-5 h-5 text-purple-400" />
            <div className="w-20 h-3 bg-slate-700 rounded-full" />
          </div>
          <div className="w-full h-2.5 bg-slate-600 rounded-full" />
          <div className="w-3/4 h-2.5 bg-slate-600 rounded-full" />
        </div>
      </div>

      {/* Main Document */}
      <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 md:p-12 flex flex-col gap-4 sm:gap-6 relative overflow-hidden shadow-inner">
        <div className="w-2/3 sm:w-1/2 h-6 sm:h-8 bg-slate-200 rounded-lg animate-[fadeIn_0.5s_ease-out_forwards]" />

        <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-6">
          <div
            className="w-full h-2.5 sm:h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left"
            style={{ transform: "scaleX(0)" }}
          />
          <div
            className="w-full h-2.5 sm:h-3 bg-slate-100 rounded-full animate-[expandWidth_1.2s_ease-out_forwards] origin-left"
            style={{ transform: "scaleX(0)", animationDelay: "0.2s" }}
          />
          <div
            className="w-4/5 h-2.5 sm:h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left"
            style={{ transform: "scaleX(0)", animationDelay: "0.4s" }}
          />
        </div>

        <div
          className="w-1/2 sm:w-1/3 h-4 sm:h-5 bg-slate-200 rounded-lg mt-4 sm:mt-8 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-4">
          <div
            className="w-full h-2.5 sm:h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left"
            style={{ transform: "scaleX(0)", animationDelay: "1.7s" }}
          />
          <div
            className="w-5/6 h-2.5 sm:h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left"
            style={{ transform: "scaleX(0)", animationDelay: "1.9s" }}
          />
        </div>

        {/* Floating AI Button */}
        <div
          className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center animate-bounce"
          style={{ animationDelay: "2.5s" }}
        >
          <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes expandWidth {
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
