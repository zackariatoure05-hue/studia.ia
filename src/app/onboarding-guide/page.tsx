"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Mic, BrainCircuit, Smartphone, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// --- ANIMATED COMPONENTS (MOTION DESIGN) ---

const AnimatedDashboard = () => (
  <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
    <div 
      className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 relative"
      style={{
        transform: "rotateX(15deg) rotateY(-10deg) translateZ(50px)",
        boxShadow: "-20px 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        transition: "transform 0.5s ease-out"
      }}
    >
      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-slate-800/80 p-3 border-r border-slate-700 flex flex-col gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
          <Sparkles className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full" />
        <div className="w-3/4 h-2 bg-slate-700 rounded-full" />
        <div className="w-full h-2 bg-slate-700 rounded-full mt-auto" />
      </div>
      {/* Main Content */}
      <div className="ml-[25%] p-6">
        <div className="w-1/2 h-4 bg-slate-700 rounded-full mb-6" />
        {/* Floating Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-indigo-600/20 rounded-xl border border-indigo-500/30 p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/10 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
            <FileText className="w-6 h-6 text-indigo-400 mb-2" />
            <div className="w-full h-2 bg-indigo-400/50 rounded-full" />
          </div>
          <div className="h-24 bg-purple-600/20 rounded-xl border border-purple-500/30 p-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-purple-500/10 translate-x-[-100%] animate-[shimmer_2s_infinite_0.5s]" />
             <BrainCircuit className="w-6 h-6 text-purple-400 mb-2" />
             <div className="w-3/4 h-2 bg-purple-400/50 rounded-full" />
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

const AnimatedRecording = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ripple effects */}
      <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute w-48 h-48 bg-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      
      {/* Main Mic Button */}
      <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
        <Mic className="w-10 h-10 text-white animate-pulse" />
      </div>

      {/* Audio visualizer bars */}
      <div className="absolute bottom-10 flex items-end justify-center gap-1.5 h-16 w-full px-12">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="w-2 bg-blue-400 rounded-t-full origin-bottom"
            style={{
              animation: `soundBar 0.8s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.1}s`,
              height: '20%'
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes soundBar {
          0% { height: 10%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
};

const AnimatedFlashcards = () => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped(prev => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
      <div 
        className="relative w-64 h-80 transition-transform duration-700 preserve-3d cursor-pointer"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-center">
          <BrainCircuit className="w-10 h-10 text-purple-500 mb-6" />
          <h3 className="font-bold text-slate-800 text-lg mb-2">Qu'est-ce que la mitose ?</h3>
          <p className="text-sm text-slate-400 mt-auto">StudIA AI</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-center text-white" style={{ transform: 'rotateY(180deg)' }}>
          <CheckCircle2 className="w-10 h-10 text-white/80 mb-6" />
          <p className="font-semibold text-white/90">Processus de division cellulaire produisant deux cellules filles identiques.</p>
        </div>
      </div>
      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

const AnimatedPWA = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Phone Outline */}
      <div className="w-48 h-[340px] border-[6px] border-slate-800 rounded-[2.5rem] bg-slate-50 relative overflow-hidden flex flex-col shadow-2xl">
        <div className="w-20 h-4 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20" />
        
        {/* Screen Content */}
        <div className="flex-1 p-4 flex flex-col items-center justify-center gap-6 relative">
          
          {/* App Icons Grid */}
          <div className="grid grid-cols-3 gap-3 w-full opacity-30 px-2">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="aspect-square bg-slate-300 rounded-xl" />
            ))}
          </div>

          {/* The App Icon dropping in */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[dropIn_1s_ease-out_forwards]">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center relative">
              <Sparkles className="w-8 h-8 text-white" />
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
            </div>
            <p className="text-center text-[10px] font-medium text-slate-800 mt-2">StudIA</p>
          </div>

          {/* Tooltip popping up */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-2 px-4 rounded-full whitespace-nowrap shadow-xl opacity-0 animate-[popUp_0.5s_ease-out_1.5s_forwards]">
            Ajouté à l'écran d'accueil !
          </div>

        </div>
      </div>
      <style jsx>{`
        @keyframes dropIn {
          0% { transform: translate(-50%, -150px) scale(0.5); opacity: 0; }
          60% { transform: translate(-50%, calc(-50% + 10px)) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes popUp {
          0% { transform: translate(-50%, 20px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};


// --- MAIN PAGE ---

const STEPS = [
  {
    id: 1,
    title: "Prêt à craquer tes partiels ?",
    description: "Bienvenue dans StudIA. Voici comment nous allons transformer tes heures de cours en véritables fiches de révision, sans aucun effort.",
    icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    component: <AnimatedDashboard />,
    color: "from-indigo-500/20 to-purple-500/20"
  },
  {
    id: 2,
    title: "L'Enregistrement Live",
    description: "En amphi ou en TD, lance simplement un nouvel enregistrement. L'IA écoute et transcrit tout en direct avec une précision chirurgicale.",
    icon: <Mic className="w-6 h-6 text-blue-500" />,
    component: <AnimatedRecording />,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 3,
    title: "Résumés & Flashcards",
    description: "Dès que le cours est terminé, l'IA analyse la transcription pour te générer un résumé structuré et des flashcards pour réviser activement.",
    icon: <BrainCircuit className="w-6 h-6 text-purple-500" />,
    component: <AnimatedFlashcards />,
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 4,
    title: "Installe l'Application (PWA)",
    description: "Pour avoir StudIA toujours dans ta poche : appuie sur le bouton « Partager » de ton navigateur (Safari/Chrome), puis choisis « Sur l'écran d'accueil ».",
    icon: <Smartphone className="w-6 h-6 text-green-500" />,
    component: <AnimatedPWA />,
    color: "from-green-500/20 to-emerald-500/20"
  }
];

export default function OnboardingGuidePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/choix-abonnement");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 overflow-hidden relative">
      {/* Background Dynamic Blob */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${step.color} rounded-full blur-[100px] opacity-40 transition-colors duration-1000 -z-10`}
      />

      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 flex flex-col min-h-[600px] relative z-10">
        
        {/* Top Progress Bar */}
        <div className="flex h-1.5 bg-slate-100/50 w-full shrink-0">
          {STEPS.map((s, i) => (
            <div 
              key={s.id} 
              className={`h-full flex-1 transition-all duration-700 ease-out ${i <= currentStep ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-transparent'}`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* Left Text Side */}
          <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100 relative">
            <div className="absolute top-8 left-8 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center transition-transform duration-500 animate-bounce">
              {step.icon}
            </div>
            
            <div className="mt-16">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight animate-in slide-in-from-left-8 duration-700 fade-in">
                {currentStep === 0 && user?.prenom ? `Salut ${user.prenom} ! ` : ""}{step.title}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed animate-in slide-in-from-left-8 duration-700 delay-150 fade-in">
                {step.description}
              </p>
            </div>
          </div>

          {/* Right Visual Animation Side */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-slate-50/50 relative overflow-hidden min-h-[350px]">
            {/* Component Key keeps animation remounting properly on step change */}
            <div key={currentStep} className="w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500 fade-in">
               {step.component}
            </div>
          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="p-6 md:px-12 bg-white/50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`p-4 rounded-2xl flex items-center justify-center transition-all ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:-translate-x-1'}`}
            aria-label="Étape précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="group relative bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 hover:scale-[1.02] transition-all duration-300 shadow-xl overflow-hidden flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            <style jsx>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}</style>
            
            {currentStep === STEPS.length - 1 ? (
              <span className="relative z-10 flex items-center gap-2">Choisir mon plan <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            ) : (
              <span className="relative z-10 flex items-center gap-2">Suivant <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
