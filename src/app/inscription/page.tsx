"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";

function IconGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type Errors = {
  nom?: string;
  email?: string;
  password?: string;
  global?: string;
};

function InscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";
  const { register } = useAuth();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const e: Errors = {};
    if (!nom.trim() || nom.trim().length < 2) e.nom = "Le nom doit contenir au moins 2 caractères.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Adresse e-mail invalide.";
    if (password.length < 8) e.password = "Le mot de passe doit contenir au moins 8 caractères.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = register(nom.trim(), email.trim(), password);
    if (!result.ok) {
      setErrors({ global: result.error });
      setLoading(false);
      return;
    }
    // Rediriger vers la page de choix d'abonnement (Checkout)
    router.push("/onboarding");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "oklch(0.98 0.01 276)",
      }}
    >
      <header
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          background: "#fff",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--foreground)",
            letterSpacing: "-0.02em",
          }}
        >
          Studi<span style={{ color: "var(--primary)" }}>IA</span>
        </Link>
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
            width: "100%",
            maxWidth: 440,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "calc(var(--radius) + 4px)",
            padding: "2.5rem 2rem",
            boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                marginBottom: "0.35rem",
              }}
            >
              Créer un compte
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
              Rejoins des milliers d&apos;étudiants qui révisent mieux.
            </p>
          </div>

          <button
            type="button"
            style={{
              width: "100%",
              padding: "0.65rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--foreground)",
              marginBottom: "1.5rem",
            }}
            onClick={() => alert("OAuth Google disponible prochainement.")}
          >
            <IconGoogle /> Continuer avec Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span
              style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", whiteSpace: "nowrap" }}
            >
              ou avec ton email
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {errors.global && (
            <div
              style={{
                background: "oklch(0.97 0.02 27)",
                border: "1px solid oklch(0.85 0.1 27)",
                borderRadius: "var(--radius)",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                color: "oklch(0.5 0.2 27)",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              ⚠️ {errors.global}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            <div>
              <label
                htmlFor="reg-nom"
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  marginBottom: "0.4rem",
                  color: "var(--foreground)",
                }}
              >
                Nom complet
              </label>
              <input
                id="reg-nom"
                type="text"
                autoComplete="name"
                placeholder="Jean Dupont"
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value);
                  setErrors((prev) => ({ ...prev, nom: undefined, global: undefined }));
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  border: `1px solid ${errors.nom ? "oklch(0.577 0.245 27.325)" : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.nom && (
                <p
                  style={{
                    color: "oklch(0.577 0.245 27.325)",
                    fontSize: "0.8rem",
                    marginTop: "0.3rem",
                  }}
                >
                  {errors.nom}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg-email"
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  marginBottom: "0.4rem",
                  color: "var(--foreground)",
                }}
              >
                Adresse e-mail
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="jean@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined, global: undefined }));
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  border: `1px solid ${errors.email ? "oklch(0.577 0.245 27.325)" : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.email && (
                <p
                  style={{
                    color: "oklch(0.577 0.245 27.325)",
                    fontSize: "0.8rem",
                    marginTop: "0.3rem",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg-password"
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  marginBottom: "0.4rem",
                  color: "var(--foreground)",
                }}
              >
                Mot de passe
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                placeholder="8 caractères minimum"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  border: `1px solid ${errors.password ? "oklch(0.577 0.245 27.325)" : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.password && (
                <p
                  style={{
                    color: "oklch(0.577 0.245 27.325)",
                    fontSize: "0.8rem",
                    marginTop: "0.3rem",
                  }}
                >
                  {errors.password}
                </p>
              )}
              {!errors.password && password.length > 0 && (
                <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.2rem" }}>
                  {[1, 2, 3].map((l) => (
                    <div
                      key={l}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 99,
                        background:
                          password.length >= l * 4
                            ? password.length >= 10
                              ? "oklch(0.6 0.2 145)"
                              : "oklch(0.7 0.2 50)"
                            : "var(--border)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: loading ? "var(--muted)" : "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "0.25rem",
              }}
            >
              {loading ? "Création du compte…" : "S'inscrire"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.85rem",
              color: "var(--muted-foreground)",
            }}
          >
            Déjà un compte ?{" "}
            <Link
              href="/connexion"
              style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <InscriptionContent />
    </Suspense>
  );
}
