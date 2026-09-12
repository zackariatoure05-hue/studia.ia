"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Plan } from "@/contexts/AuthContext";
import { Check, Sparkles, Zap, Crown, ChevronRight } from "lucide-react";

const PLANS = [
  {
    id: "decouverte",
    name: "Découverte",
    priceMonthly: "1,99€",
    priceAnnual: "1,66€",
    priceAnnualTotal: "19,99€",
    icon: Sparkles,
    color: "oklch(0.6 0.15 250)",
    features: ["4 heures d'audio / mois", "Résumés standards", "Flashcards limitées"],
  },
  {
    id: "etudiant",
    name: "Étudiant",
    priceMonthly: "4,99€",
    priceAnnual: "4,16€",
    priceAnnualTotal: "49,99€",
    icon: Zap,
    color: "oklch(0.6 0.2 27)",
    popular: true,
    features: [
      "20 heures d'audio / mois",
      "Résumés approfondis",
      "Flashcards détaillées",
      "Génération illimitée (texte)",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: "9,99€",
    priceAnnual: "7,49€",
    priceAnnualTotal: "89,99€",
    icon: Crown,
    color: "oklch(0.5 0.2 300)",
    features: [
      "Audio illimité",
      "Résumés exhaustifs (niveau Master)",
      "Mode révision avec tous profils d'IA",
      "Support prioritaire",
      "Export Notion & Anki",
    ],
  },
];

export default function ChoixAbonnementPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(user?.plan || "etudiant");
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleStartTrial() {
    setLoading(true);
    updateUser({
      plan: selectedPlan as any,
      billingCycle: isAnnual ? "annual" : "monthly",
    });

    await new Promise((r) => setTimeout(r, 600));

    // Redirige vers le checkout (paywall)
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="p-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">StudIA</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-16 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" /> Ton compte est créé !
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Choisis ton plan pour démarrer
            <br />
            ton abonnement.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Sélectionne le niveau d'approfondissement qui te correspond et passe à la vitesse
            supérieure.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-sm font-semibold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}
            >
              Mensuel
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-indigo-600 transition-colors focus:outline-none"
            >
              <div
                className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${isAnnual ? "translate-x-8" : ""}`}
              ></div>
            </button>
            <span
              className={`text-sm font-semibold flex items-center gap-2 ${isAnnual ? "text-slate-900" : "text-slate-500"}`}
            >
              Annuel{" "}
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                -30%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as Plan)}
                className={`relative bg-white rounded-3xl p-8 cursor-pointer transition-all duration-300 border-2 flex flex-col ${
                  isSelected
                    ? "border-indigo-600 shadow-2xl shadow-indigo-600/20 scale-105"
                    : "border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Le plus choisi
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-slate-500 font-medium pb-1">/mois</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-emerald-600 font-medium mt-1">
                      Facturé {plan.priceAnnualTotal} par an
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 shrink-0 ${isSelected ? "text-indigo-600" : "text-slate-400"}`}
                      />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={handleStartTrial}
            disabled={loading}
            className="bg-slate-900 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2 mx-auto disabled:opacity-70 disabled:scale-100 hover:scale-105"
          >
            {loading ? (
              "Préparation..."
            ) : (
              <>
                S'abonner à {PLANS.find((p) => p.id === selectedPlan)?.name}{" "}
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>
          <p className="text-slate-500 text-sm mt-4">
            Tu pourras changer de plan ou annuler à tout moment.
          </p>
        </div>
      </main>
    </div>
  );
}
