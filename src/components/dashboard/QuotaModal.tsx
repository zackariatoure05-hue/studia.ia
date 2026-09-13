"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Zap, Clock, CreditCard } from "lucide-react";
import { useAuth, PLAN_LABELS } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuotaModal({ isOpen, onClose }: QuotaModalProps) {
  const { user, audioLimitMinutes, audioRemainingMinutes, buyExtraMinutes } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!user) return null;

  const totalLimit = audioLimitMinutes + (user.extraAudioMinutes || 0);

  const handleBuy = async (minutes: number, price: string) => {
    setLoading(true);
    // Simuler un appel API Stripe
    await new Promise((resolve) => setTimeout(resolve, 1500));
    buyExtraMinutes(minutes);
    setSuccessMsg(`Succès ! ${minutes} minutes ajoutées à ton compte.`);
    setLoading(false);
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quota d'enregistrement épuisé"
      icon={<Clock className="w-6 h-6" />}
    >
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <p className="text-sm text-slate-600">
            Tu as utilisé la totalité de ton quota actuel (<strong>{totalLimit} min</strong>). Ton
            plan actuel est : <strong className="text-indigo-600">{PLAN_LABELS[user.plan]}</strong>.
          </p>
        </div>

        {successMsg ? (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 text-center font-bold animate-in fade-in zoom-in">
            {successMsg}
          </div>
        ) : (
          <>
            <p className="font-semibold text-slate-800">Recharge tes minutes instantanément :</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Option 20 min */}
              <div className="relative flex flex-col bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-indigo-500 transition-colors group cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-2xl text-slate-900">
                    +20<span className="text-sm text-slate-500 font-medium"> min</span>
                  </span>
                  <span className="font-bold text-lg text-indigo-600">1,00 €</span>
                </div>
                <button
                  onClick={() => handleBuy(20, "1,00")}
                  disabled={loading}
                  className="mt-4 w-full bg-slate-900 text-white rounded-xl py-2.5 font-semibold hover:bg-slate-800 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {loading ? "Achat..." : "Acheter"}
                </button>
              </div>

              {/* Option 60 min */}
              <div className="relative flex flex-col bg-white border-2 border-indigo-500 rounded-2xl p-4 group cursor-pointer shadow-md transform hover:-translate-y-1 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Le plus rentable
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-2xl text-slate-900">
                    +60<span className="text-sm text-slate-500 font-medium"> min</span>
                  </span>
                  <span className="font-bold text-lg text-indigo-600">1,80 €</span>
                </div>
                <button
                  onClick={() => handleBuy(60, "1,80")}
                  disabled={loading}
                  className="mt-4 w-full bg-indigo-600 text-white rounded-xl py-2.5 font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  {loading ? "Achat..." : "Acheter"}
                </button>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-3">Ou passe à la vitesse supérieure :</p>
              <button
                onClick={() => {
                  onClose();
                  router.push("/tarifs");
                }}
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
              >
                Changer d'abonnement (dès 4,99 €)
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
