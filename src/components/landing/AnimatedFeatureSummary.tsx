"use client";
import { Sparkles, FileText, ListChecks, Bot } from "lucide-react";

export default function AnimatedFeatureSummary() {
  return (
    <div className="w-full aspect-video bg-slate-900 flex p-4 md:p-8 gap-4 md:gap-8 overflow-hidden h-full min-h-[400px]">
      {/* Sidebar Summary */}
      <div className="hidden md:flex w-1/3 bg-slate-800/80 rounded-3xl border border-slate-700 p-8 flex-col gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-6">
           <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
         </div>
         
         <div className="space-y-5 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0" style={{ animationDelay: '0.2s' }}>
           <div className="flex items-center gap-3 mb-3">
             <FileText className="w-5 h-5 text-indigo-400" />
             <div className="w-24 h-3 bg-slate-700 rounded-full" />
           </div>
           <div className="w-full h-2.5 bg-slate-600 rounded-full" />
           <div className="w-5/6 h-2.5 bg-slate-600 rounded-full" />
         </div>

         <div className="space-y-5 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0" style={{ animationDelay: '1s' }}>
           <div className="flex items-center gap-3 mb-3">
             <ListChecks className="w-5 h-5 text-purple-400" />
             <div className="w-20 h-3 bg-slate-700 rounded-full" />
           </div>
           <div className="w-full h-2.5 bg-slate-600 rounded-full" />
           <div className="w-3/4 h-2.5 bg-slate-600 rounded-full" />
         </div>
      </div>

      {/* Main Document */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden shadow-inner">
         <div className="w-1/2 h-8 bg-slate-200 rounded-lg animate-[fadeIn_0.5s_ease-out_forwards]" />
         
         <div className="space-y-4 mt-6">
           <div className="w-full h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left" style={{ transform: 'scaleX(0)' }} />
           <div className="w-full h-3 bg-slate-100 rounded-full animate-[expandWidth_1.2s_ease-out_forwards] origin-left" style={{ transform: 'scaleX(0)', animationDelay: '0.2s' }} />
           <div className="w-4/5 h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left" style={{ transform: 'scaleX(0)', animationDelay: '0.4s' }} />
         </div>

         <div className="w-1/3 h-5 bg-slate-200 rounded-lg mt-8 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0" style={{ animationDelay: '1.5s' }} />
         
         <div className="space-y-4 mt-4">
           <div className="w-full h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left" style={{ transform: 'scaleX(0)', animationDelay: '1.7s' }} />
           <div className="w-5/6 h-3 bg-slate-100 rounded-full animate-[expandWidth_1s_ease-out_forwards] origin-left" style={{ transform: 'scaleX(0)', animationDelay: '1.9s' }} />
         </div>
         
         {/* Floating AI Button */}
         <div className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center animate-bounce" style={{ animationDelay: '2.5s' }}>
           <Bot className="w-7 h-7 text-white" />
         </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes expandWidth {
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
