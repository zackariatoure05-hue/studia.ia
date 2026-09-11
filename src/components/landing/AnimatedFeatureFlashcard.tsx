"use client";
import { useState, useEffect } from "react";
import { BrainCircuit, CheckCircle2 } from "lucide-react";

export default function AnimatedFeatureFlashcard() {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-square flex items-center justify-center perspective-[1200px] bg-slate-50 relative overflow-hidden h-full min-h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
      
      <div 
        className="relative w-[70%] h-[70%] max-h-[350px] transition-transform duration-1000 preserve-3d cursor-pointer shadow-2xl rounded-3xl"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
          <BrainCircuit className="w-12 h-12 text-purple-500 mb-6" />
          <h3 className="font-extrabold text-slate-800 text-2xl mb-4">Qu'est-ce que la mitose ?</h3>
          <p className="text-sm font-semibold text-slate-400 mt-auto bg-slate-100 px-4 py-2 rounded-full">Clique pour retourner</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white" style={{ transform: 'rotateY(180deg)' }}>
          <CheckCircle2 className="w-12 h-12 text-white/90 mb-6" />
          <p className="font-bold text-lg text-white/95 leading-relaxed">Division cellulaire produisant deux cellules filles génétiquement identiques.</p>
        </div>
      </div>
      
      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
