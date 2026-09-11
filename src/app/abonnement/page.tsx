"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Plan } from "@/contexts/AuthContext";
import { Check, Sparkles, Zap, Crown, Lock } from "lucide-react";

const PLANS = [
  {
    id: "decouverte",
    name: "Découverte",
    priceMonthly: "1,99€",
    priceAnnual: "1,66€",
    priceAnnualTotal: "19,99€",
    icon: Sparkles,
    color: "oklch(0.6 0.15 250)",
    features: [
      "4 heures d'audio / mois",
      "Résumés standards",
      "Flashcards limitées",
    ]
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
    ]
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
    ]
  }
];

export default function AbonnementPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(user?.plan || "etudiant");
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);

  // Simulation d'un paiement qui active le compte
  async function handleSubscribe() {
    setLoading(true);
    // Simulation réseau (appel Stripe ou autre en réalité)
    await new Promise(r => setTimeout(r, 800));
    
    // On met à jour l'utilisateur pour qu'il soit "active" avec le plan choisi
    updateUser({ 
      plan: selectedPlan,
      status: "active",
      billingCycle: isAnnual ? "annual" : "monthly"
    });
    
    // Redirection vers le tableau de bord
    router.push("/tableau-de-bord");
  }

  const isExpired = user?.status === "trial" && user.trialEndsAt && (new Date(user.trialEndsAt).getTime() < Date.now());

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "oklch(0.98 0.01 276)" }}>
      {/* Navbar simplifiée */}
      <header style={{ padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, oklch(0.6 0.2 27), oklch(0.5 0.2 300))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "bold", fontSize: "1rem"
          }}>S</div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Studia</span>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem", animation: "fadeIn 0.5s ease-out" }}>
          {isExpired ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(0.95 0.02 27)", color: "oklch(0.5 0.2 27)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              <Lock size={16} /> Abonnement inactif
            </div>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "oklch(0.95 0.02 27)", color: "oklch(0.5 0.2 27)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              <Sparkles size={16} /> Gérer mon abonnement
            </div>
          )}
          
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--foreground)", marginBottom: "1rem", lineHeight: 1.1 }}>
            {isExpired ? "Choisis un plan pour continuer" : "Passe à la vitesse supérieure"}
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto", marginBottom: "2rem" }}>
            {isExpired 
              ? "Ton abonnement est inactif. Abonne-toi pour retrouver l'accès à tes cours et continuer de générer des résumés."
              : "Améliore ton forfait pour générer plus de résumés, profiter d'enregistrements audio plus longs et débloquer les fonctionnalités premium."}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: !isAnnual ? "var(--foreground)" : "var(--muted-foreground)" }}>Mensuel</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              style={{
                position: "relative", width: "64px", height: "32px", borderRadius: "999px",
                background: "oklch(0.6 0.2 250)", border: "none", cursor: "pointer", outline: "none"
              }}
            >
              <div style={{
                position: "absolute", top: "4px", left: "4px", background: "white", width: "24px", height: "24px", borderRadius: "999px",
                transform: isAnnual ? "translateX(32px)" : "translateX(0)", transition: "transform 0.2s"
              }}></div>
            </button>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", color: isAnnual ? "var(--foreground)" : "var(--muted-foreground)" }}>
              Annuel <span style={{ background: "oklch(0.9 0.1 150)", color: "oklch(0.5 0.1 150)", fontSize: "0.75rem", padding: "0.125rem 0.5rem", borderRadius: "999px" }}>-30%</span>
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", width: "100%" }}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const Icon = plan.icon;
            
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as Plan)}
                style={{
                  position: "relative",
                  background: isSelected ? "white" : "oklch(0.99 0 0)",
                  borderRadius: "24px",
                  padding: "2rem",
                  cursor: "pointer",
                  border: isSelected ? `2px solid ${plan.color}` : "2px solid oklch(0.9 0 0)",
                  boxShadow: isSelected ? `0 10px 40px -10px ${plan.color}40` : "0 4px 6px -1px rgba(0,0,0,0.05)",
                  transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex", flexDirection: "column"
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: plan.color, color: "white", fontSize: "0.75rem", fontWeight: 700,
                    padding: "0.25rem 1rem", borderRadius: "999px", letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>
                    Le plus choisi
                  </div>
                )}
                
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: `${plan.color}15`, color: plan.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>{plan.name}</h3>
                  </div>
                </div>
                
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "0.25rem" }}>
                    <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.04em" }}>
                      {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span style={{ color: "var(--muted-foreground)", fontWeight: 500, paddingBottom: "0.25rem" }}>/mois</span>
                  </div>
                  {isAnnual && (
                    <div style={{ fontSize: "0.875rem", color: "oklch(0.6 0.1 150)", fontWeight: 500, marginTop: "0.25rem" }}>
                      Facturé {plan.priceAnnualTotal} par an
                    </div>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", fontSize: "0.95rem", color: "var(--foreground)" }}>
                      <Check size={18} style={{ color: plan.color, flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontWeight: 500 }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              background: "var(--foreground)",
              color: "var(--background)",
              border: "none",
              padding: "1rem 3rem",
              borderRadius: "999px",
              fontSize: "1.1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              transform: loading ? "scale(0.98)" : "scale(1)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              "Traitement du paiement..."
            ) : (
              "Confirmer mon abonnement"
            )}
          </button>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", marginTop: "1rem" }}>
            Paiement sécurisé. Annulable à tout moment.
          </p>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
