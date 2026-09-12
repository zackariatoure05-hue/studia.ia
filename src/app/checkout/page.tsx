"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    updateUser({ status: "active" });
    // Nouveau flow : Checkout -> Dashboard
    router.push("/tableau-de-bord");
  }

  const planName =
    user?.plan === "premium" ? "Premium" : user?.plan === "decouverte" ? "Découverte" : "Étudiant";
  const isAnnual = user?.billingCycle === "annual";
  const planPrice =
    user?.plan === "premium"
      ? isAnnual
        ? "89,99€"
        : "9,99€"
      : user?.plan === "decouverte"
        ? isAnnual
          ? "19,99€"
          : "1,99€"
        : isAnnual
          ? "49,99€"
          : "4,99€";
  const planSuffix = isAnnual ? "/an" : "/mois";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Left side: Order Summary */}
        <div className="bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Finalise ton inscription</h2>
          <p className="text-slate-400 mb-12">
            Rentre tes informations de paiement pour activer ton abonnement.
          </p>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-slate-200">Plan {planName}</span>
              <span className="font-bold">
                {planPrice}
                {planSuffix}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-700 pt-4">
              <span>Total à payer</span>
              <span className="text-xl font-extrabold text-white">{planPrice}</span>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Paiement 100% sécurisé via Stripe
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Annulable à tout moment en 1 clic
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Tu seras prévenu avant le
              prélèvement
            </li>
          </ul>
        </div>

        {/* Right side: Payment Form */}
        <div className="p-8 md:p-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" /> Moyen de paiement
          </h3>

          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Numéro de carte
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                pattern="\d{4} \d{4} \d{4} \d{4}"
                title="Veuillez entrer 16 chiffres"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
                  title="Format MM/AA requis"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  required
                  maxLength={3}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                  pattern="\d{3}"
                  title="3 chiffres requis"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nom sur la carte
              </label>
              <input
                type="text"
                placeholder="Nom complet"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                `Payer ${planPrice}${planSuffix}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
