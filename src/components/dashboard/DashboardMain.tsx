"use client";

import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const { isError, triggerError } = useData();
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user) {
      if (!user.hasCompletedOnboarding) {
        router.push("/onboarding");
      } else if (user.status === "trial" && new Date(user.trialEndsAt).getTime() < Date.now()) {
        router.push("/abonnement");
      }
    }
  }, [isLoggedIn, user, router]);

  // Si pas encore d'user ou pas complété/expiré, on peut éviter un flash
  if (isLoggedIn && user) {
    if (
      !user.hasCompletedOnboarding ||
      (user.status === "trial" && new Date(user.trialEndsAt).getTime() < Date.now())
    ) {
      return null;
    }
  }

  if (isError) {
    return (
      <div
        style={{
          flex: 1,
          padding: "2rem 2.5rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Un bouton pour reset l'erreur pour la démo */}
        <div>
          <button
            onClick={() => triggerError(false)}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--border)",
              border: "none",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Retour (Annuler l&apos;erreur)
          </button>
        </div>
        <ErrorDisplay onRetry={() => triggerError(false)} />
      </div>
    );
  }

  return <main style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto" }}>{children}</main>;
}
