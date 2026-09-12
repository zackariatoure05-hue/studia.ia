"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useAuth, type Plan } from "@/contexts/AuthContext";

const PLANS = [
  {
    id: "decouverte" as Plan,
    nom: "Découverte",
    prix_mensuel: 1.99,
    prix_annuel: 1.66,
    couleur: "var(--muted-foreground)",
    bg: "#f9f9f9",
    border: "var(--border)",
    badge: null,
    cta: "Choisir Découverte",
    description: "Idéal pour réviser quelques matières.",
    fonctionnalites: [
      { label: "Cours par mois", valeur: "3 cours" },
      { label: "Résumés automatiques", valeur: "✓" },
      { label: "Flashcards générées", valeur: "jusqu'à 5/cours" },
      { label: "Enregistrement audio", valeur: "✓" },
      { label: "Transcription audio", valeur: "4 heures/mois" },
      { label: "Facultés & matières", valeur: "1 faculté max" },
      { label: "Export PDF", valeur: "✗" },
      { label: "Révision intelligente (SRS)", valeur: "✗" },
      { label: "Support", valeur: "FAQ" },
    ],
  },
  {
    id: "etudiant" as Plan,
    nom: "Étudiant",
    prix_mensuel: 4.99,
    prix_annuel: 4.16,
    couleur: "var(--primary)",
    bg: "oklch(0.97 0.02 276)",
    border: "var(--primary)",
    badge: "Recommandé",
    cta: "Choisir Étudiant",
    description: "L'essentiel pour optimiser ses révisions.",
    fonctionnalites: [
      { label: "Cours par mois", valeur: "20 cours" },
      { label: "Résumés automatiques", valeur: "✓" },
      { label: "Flashcards générées", valeur: "illimitées" },
      { label: "Enregistrement audio", valeur: "✓" },
      { label: "Transcription audio", valeur: "20 heures/mois" },
      { label: "Facultés & matières", valeur: "illimitées" },
      { label: "Export PDF", valeur: "✓" },
      { label: "Révision intelligente (SRS)", valeur: "✓" },
      { label: "Support", valeur: "Email" },
    ],
  },
  {
    id: "premium" as Plan,
    nom: "Premium",
    prix_mensuel: 9.99,
    prix_annuel: 7.49,
    couleur: "oklch(0.5 0.25 300)",
    bg: "oklch(0.97 0.02 300)",
    border: "oklch(0.5 0.25 300)",
    badge: "Tout inclus",
    cta: "Choisir Premium",
    description: "Pour les étudiants qui visent l'excellence.",
    fonctionnalites: [
      { label: "Cours par mois", valeur: "illimités" },
      { label: "Résumés automatiques", valeur: "✓" },
      { label: "Flashcards générées", valeur: "illimitées" },
      { label: "Enregistrement audio", valeur: "✓" },
      { label: "Transcription audio", valeur: "illimitée" },
      { label: "Facultés & matières", valeur: "illimitées" },
      { label: "Export PDF", valeur: "✓" },
      { label: "Révision intelligente (SRS)", valeur: "✓" },
      { label: "Support", valeur: "Prioritaire 24/7" },
    ],
  },
];

const ALL_FEATURES = [
  "Cours par mois",
  "Résumés automatiques",
  "Flashcards générées",
  "Enregistrement audio",
  "Transcription audio",
  "Facultés & matières",
  "Export PDF",
  "Révision intelligente (SRS)",
  "Support",
];

function TarifsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, setPlan, user } = useAuth();
  const isNew = searchParams.get("nouveau") === "true";

  const [annuel, setAnnuel] = useState(false);
  const [confirmedPlan, setConfirmedPlan] = useState<string | null>(null);

  // Pre-select Étudiant if coming from registration
  const [highlightedPlan, setHighlightedPlan] = useState<Plan | null>(isNew ? "etudiant" : null);

  useEffect(() => {
    if (isNew) setHighlightedPlan("etudiant");
  }, [isNew]);

  const handleChoose = (planId: Plan) => {
    if (isLoggedIn) {
      setPlan(planId);
      setConfirmedPlan(planId);
      setTimeout(() => {
        router.push(`/paiement?plan=${planId}`);
      }, 800);
    } else {
      router.push(`/inscription?plan=${planId}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "oklch(0.98 0.01 276)",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.25rem 2rem",
          borderBottom: "1px solid var(--border)",
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "var(--foreground)",
            letterSpacing: "-0.02em",
          }}
        >
          Studi<span style={{ color: "var(--primary)" }}>IA</span>
        </Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isLoggedIn ? (
            <Link
              href="/tableau-de-bord"
              style={{
                background: "var(--primary)",
                color: "#fff",
                padding: "0.5rem 1.1rem",
                borderRadius: "var(--radius)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Mon tableau de bord →
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                style={{
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  padding: "0.5rem 1.1rem",
                  borderRadius: "var(--radius)",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        {/* Welcome banner for new users */}
        {isNew && (
          <div
            style={{
              background: "oklch(0.97 0.03 276)",
              border: "1px solid var(--primary)",
              borderRadius: "1rem",
              padding: "1.25rem 1.5rem",
              marginBottom: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span style={{ fontSize: "1.75rem" }}>🎉</span>
            <div>
              <p
                style={{ fontWeight: 800, fontSize: "1rem", color: "var(--foreground)", margin: 0 }}
              >
                Bienvenue {user?.nom} ! Ton compte a été créé avec succès.
              </p>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.88rem",
                  margin: "0.2rem 0 0",
                }}
              >
                Choisis ta formule pour commencer. La formule <strong>Étudiant</strong> est la plus
                populaire !
              </p>
            </div>
          </div>
        )}

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
              margin: "0 0 1rem",
            }}
          >
            Choisissez votre formule
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--muted-foreground)",
              maxWidth: "550px",
              margin: "0 auto 2rem",
            }}
          >
            Commencez gratuitement, évoluez selon vos besoins. Résiliez à tout moment.
          </p>

          {/* Toggle annuel/mensuel */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              padding: "0.35rem 1rem",
            }}
          >
            <button
              onClick={() => setAnnuel(false)}
              style={{
                background: !annuel ? "var(--primary)" : "none",
                color: !annuel ? "#fff" : "var(--muted-foreground)",
                border: "none",
                padding: "0.3rem 0.9rem",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnuel(true)}
              style={{
                background: annuel ? "var(--primary)" : "none",
                color: annuel ? "#fff" : "var(--muted-foreground)",
                border: "none",
                padding: "0.3rem 0.9rem",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              Annuel
              <span
                style={{
                  background: "oklch(0.85 0.1 150)",
                  color: "oklch(0.4 0.15 150)",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "0.1rem 0.4rem",
                  borderRadius: "999px",
                }}
              >
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          {PLANS.map((plan) => {
            const prix = annuel ? plan.prix_annuel : plan.prix_mensuel;
            const isConfirmed = confirmedPlan === plan.id;
            const isHighlighted = highlightedPlan === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  background: plan.bg,
                  border: `2px solid ${isHighlighted ? plan.couleur : plan.border}`,
                  borderRadius: "1rem",
                  padding: "2rem",
                  position: "relative",
                  boxShadow: isHighlighted
                    ? `0 12px 40px oklch(0.511 0.262 276.966 / 0.2)`
                    : plan.badge === "Recommandé"
                      ? `0 8px 32px oklch(0.511 0.262 276.966 / 0.12)`
                      : "0 2px 8px rgba(0,0,0,0.04)",
                  transform:
                    plan.badge === "Recommandé" || isHighlighted ? "scale(1.03)" : "scale(1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: plan.couleur,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      padding: "0.3rem 1rem",
                      borderRadius: "999px",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: plan.couleur,
                    margin: "0 0 0.3rem",
                  }}
                >
                  {plan.nom}
                </h2>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--muted-foreground)",
                    margin: "0 0 1.5rem",
                  }}
                >
                  {plan.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.3rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--foreground)" }}>
                    {annuel ? `${(prix * 12).toFixed(2)} €` : `${prix.toFixed(2)} €`}
                  </span>
                  {prix > 0 && (
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
                      {annuel ? "/an" : "/mois"}
                    </span>
                  )}
                </div>
                {annuel && prix > 0 && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--muted-foreground)",
                      margin: "0 0 1.5rem",
                    }}
                  >
                    soit {prix.toFixed(2)} €/mois · économisez{" "}
                    {(plan.prix_mensuel * 12 - prix * 12).toFixed(2)} €
                  </p>
                )}
                {!annuel && <div style={{ height: "1.5rem", marginBottom: "1.5rem" }} />}

                {isConfirmed ? (
                  <div
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "oklch(0.6 0.2 150)",
                      color: "#fff",
                      borderRadius: "var(--radius)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textAlign: "center",
                      animation: "fadeIn 0.3s",
                      boxSizing: "border-box",
                    }}
                  >
                    ✓ Formule activée ! Redirection…
                  </div>
                ) : (
                  <button
                    onClick={() => handleChoose(plan.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.75rem",
                      background:
                        plan.badge === "Recommandé"
                          ? "var(--primary)"
                          : plan.badge === "Tout inclus"
                            ? "oklch(0.5 0.25 300)"
                            : "#fff",
                      color: plan.badge ? "#fff" : "var(--foreground)",
                      border: plan.badge ? "none" : "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      textAlign: "center",
                      cursor: "pointer",
                      boxShadow:
                        plan.badge === "Recommandé"
                          ? "0 4px 12px oklch(0.511 0.262 276.966 / 0.25)"
                          : "none",
                      boxSizing: "border-box",
                    }}
                  >
                    {isLoggedIn ? plan.cta : "S'inscrire pour commencer"}
                  </button>
                )}

                <ul
                  style={{
                    marginTop: "1.75rem",
                    listStyle: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {plan.fonctionnalites.map((f) => (
                    <li
                      key={f.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.88rem",
                      }}
                    >
                      <span style={{ color: "var(--muted-foreground)" }}>{f.label}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            f.valeur === "✗"
                              ? "oklch(0.7 0.05 0)"
                              : f.valeur === "✓"
                                ? "oklch(0.5 0.2 150)"
                                : "var(--foreground)",
                        }}
                      >
                        {f.valeur}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Tableau comparatif */}
        <div style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Tableau comparatif complet
          </h2>
          <div
            style={{
              overflowX: "auto",
              borderRadius: "1rem",
              border: "1px solid var(--border)",
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th
                    style={{
                      padding: "1.25rem 1.5rem",
                      textAlign: "left",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      minWidth: "200px",
                    }}
                  >
                    Fonctionnalité
                  </th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      style={{
                        padding: "1.25rem 1rem",
                        textAlign: "center",
                        color: plan.couleur,
                        fontWeight: 800,
                        fontSize: "1rem",
                      }}
                    >
                      {plan.nom}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((feature, i) => (
                  <tr
                    key={feature}
                    style={{
                      borderBottom:
                        i < ALL_FEATURES.length - 1 ? "1px solid var(--border)" : "none",
                      background: i % 2 === 0 ? "#fff" : "oklch(0.99 0.005 276)",
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "var(--foreground)",
                        fontWeight: 500,
                      }}
                    >
                      {feature}
                    </td>
                    {PLANS.map((plan) => {
                      const f = plan.fonctionnalites.find((fc) => fc.label === feature);
                      const val = f?.valeur ?? "—";
                      return (
                        <td
                          key={plan.id}
                          style={{
                            padding: "1rem",
                            textAlign: "center",
                            fontWeight: 600,
                            color:
                              val === "✗"
                                ? "oklch(0.7 0.05 0)"
                                : val === "✓"
                                  ? "oklch(0.5 0.2 150)"
                                  : "var(--foreground)",
                          }}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid var(--border)" }}>
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    Prix {annuel ? "annuel (total)" : "mensuel"}
                  </td>
                  {PLANS.map((plan) => {
                    const prix = annuel ? plan.prix_annuel : plan.prix_mensuel;
                    return (
                      <td key={plan.id} style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
                        <span style={{ fontWeight: 800, fontSize: "1.1rem", color: plan.couleur }}>
                          {prix === 0
                            ? "Gratuit"
                            : annuel
                              ? `${(prix * 12).toFixed(2)} €/an`
                              : `${prix.toFixed(2)} €/mois`}
                        </span>
                        {annuel && prix > 0 && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--muted-foreground)",
                              marginTop: "0.2rem",
                            }}
                          >
                            soit {prix.toFixed(2)} €/mois
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>
            Questions fréquentes
          </h2>
          {[
            {
              q: "Puis-je changer de formule à tout moment ?",
              r: "Oui, vous pouvez évoluer ou rétrograder votre formule à tout moment depuis votre espace compte.",
            },
            {
              q: "Y a-t-il un engagement minimum ?",
              r: "Aucun engagement pour la formule mensuelle. La formule annuelle est facturée en une fois pour 12 mois.",
            },
            {
              q: "Que se passe-t-il si j'atteins ma limite de transcription ?",
              r: "L'enregistrement en direct sera temporairement désactivé jusqu'à la fin du mois. Vous pouvez toujours ajouter des cours en mode texte.",
            },
            {
              q: "Mes données sont-elles sécurisées ?",
              r: "Oui, vos cours et résumés sont chiffrés et ne sont jamais partagés avec des tiers.",
            },
          ].map(({ q, r }) => (
            <div
              key={q}
              style={{
                textAlign: "left",
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.25rem 1.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: "0 0 0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                {q}
              </p>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  margin: 0,
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                {r}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "var(--muted-foreground)",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: 0 }}>
          © 2024 StudIA ·{" "}
          <Link href="/tarifs" style={{ color: "var(--primary)", textDecoration: "none" }}>
            Tarifs
          </Link>{" "}
          ·{" "}
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Accueil
          </Link>
        </p>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `,
        }}
      />
    </div>
  );
}

export default function TarifsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Chargement…
        </div>
      }
    >
      <TarifsContent />
    </Suspense>
  );
}
