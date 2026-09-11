"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Afficher le bandeau avec un léger délai pour que la page charge d'abord
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  const handleRefuse = () => {
    localStorage.setItem("cookie_consent", "refused");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-10 duration-500 ease-out pointer-events-none">
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-5 md:p-6 pointer-events-auto flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        <div className="flex-1 flex gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary hidden sm:flex">
            <Cookie size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">On respecte ta vie privée</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nous utilisons des cookies pour assurer le bon fonctionnement du site, analyser notre trafic et améliorer ton expérience d'apprentissage. Tu peux changer d'avis à tout moment via nos <Link href="/cookies" className="text-primary hover:underline font-medium">politiques de cookies</Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleRefuse}
            className="px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-sm transition-colors w-full sm:w-auto"
          >
            Continuer sans accepter
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold text-sm shadow-md shadow-primary/20 transition-all w-full sm:w-auto"
          >
            Accepter
          </button>
        </div>

        <button 
          onClick={handleRefuse}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground md:hidden"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
