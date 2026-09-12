"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type PlanId = "etudiant" | "premium";

const PLANS: Record<PlanId, { label: string; price: string; features: string[] }> = {
  etudiant: {
    label: "Étudiant",
    price: "4,99€/mois",
    features: ["5 cours/mois", "Résumés IA", "Flashcards illimitées"],
  },
  premium: {
    label: "Premium",
    price: "9,99€/mois",
    features: [
      "Cours illimités",
      "Résumés IA avancés",
      "Flashcards illimitées",
      "Priorité support",
    ],
  },
};

function PaiementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setPlan } = useAuth();

  const planParam = (searchParams.get("plan") as PlanId) ?? "etudiant";
  const plan = PLANS[planParam] ?? PLANS.etudiant;

  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatCardNum(val: string) {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(val: string) {
    const v = val.replace(/\D/g, "").slice(0, 4);
    return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    const raw = cardNum.replace(/\s/g, "");
    if (raw.length < 16 || !expiry.includes("/") || cvc.length < 3 || !name.trim()) {
      setError("Veuillez remplir tous les champs correctement.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulation d'un paiement
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setPlan(planParam);
    router.push("/tableau-de-bord");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.25rem 2rem",
          borderBottom: "1px solid var(--border)",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "var(--foreground)",
            letterSpacing: "-0.02em",
          }}
        >
          Studi<span style={{ color: "var(--primary)" }}>IA</span>
        </Link>
        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
          🔒 Paiement sécurisé
        </span>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            maxWidth: "860px",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          {/* Récapitulatif de l'offre */}
          <div
            style={{
              flex: "1 1 280px",
              background: "var(--foreground)",
              color: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "oklch(0.77 0.17 73)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 0.5rem",
                }}
              >
                Plan sélectionné
              </p>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>{plan.label}</h2>
              <p
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  margin: "0.5rem 0 0",
                  color: "oklch(0.77 0.17 73)",
                }}
              >
                {plan.price}
              </p>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.25rem" }}>
              {plan.features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <span style={{ color: "oklch(0.77 0.17 73)", fontSize: "1rem" }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
              Annulable à tout moment · Renouvellement mensuel
            </div>
          </div>

          {/* Formulaire de paiement */}
          <form
            onSubmit={handlePay}
            style={{
              flex: "1 1 340px",
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <h3
              style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--foreground)" }}
            >
              Informations de paiement
            </h3>

            {/* Nom */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  marginBottom: "0.4rem",
                  color: "var(--foreground)",
                }}
              >
                Nom sur la carte
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Numéro */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  marginBottom: "0.4rem",
                  color: "var(--foreground)",
                }}
              >
                Numéro de carte
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={cardNum}
                  onChange={(e) => setCardNum(formatCardNum(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.5rem 0.75rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                    letterSpacing: "0.05em",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "1.2rem",
                  }}
                >
                  💳
                </span>
              </div>
            </div>

            {/* Expiry + CVC */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    marginBottom: "0.4rem",
                    color: "var(--foreground)",
                  }}
                >
                  Date d'expiration
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  inputMode="numeric"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    marginBottom: "0.4rem",
                    color: "var(--foreground)",
                  }}
                >
                  CVC
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="123"
                  inputMode="numeric"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {error && (
              <p
                style={{
                  color: "oklch(0.577 0.245 27.325)",
                  fontSize: "0.85rem",
                  margin: 0,
                  background: "oklch(0.97 0.04 27)",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.9rem",
                background: loading ? "var(--muted)" : "var(--foreground)",
                color: loading ? "var(--muted-foreground)" : "oklch(0.77 0.17 73)",
                border: "none",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Traitement en cours…" : `Payer ${plan.price}`}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.78rem",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              🔒 Paiement sécurisé SSL · Aucun stockage des données carte
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function PaiementPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PaiementContent />
    </Suspense>
  );
}
