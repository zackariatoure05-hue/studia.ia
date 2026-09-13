"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useRef } from "react";
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

  // 3D Tilt Effect State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Max rotation 10deg
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!nom.trim() || nom.trim().length < 2) e.nom = "Le nom doit contenir au moins 2 caractères.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Adresse e-mail invalide.";
    if (password.length < 8) e.password = "Le mot de passe doit contenir au moins 8 caractères.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!validate()) {
      alert("Erreur de validation (vérifie les champs en rouge)");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const result = register(nom.trim(), email.trim(), password);
      if (!result.ok) {
        setErrors({ global: result.error });
        setLoading(false);
        alert("Erreur: " + result.error);
        return;
      }
      alert("Succès ! Redirection vers onboarding...");
      window.location.href = "/onboarding";
    } catch (err: any) {
      console.error(err);
      setErrors({ global: err.message || "Erreur inattendue" });
      setLoading(false);
      alert("Erreur inattendue: " + err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Background Neo-Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-purple-300/30 rounded-full blur-[100px] animate-pulse mix-blend-multiply -top-[20%] -left-[10%]"></div>
        <div
          className="absolute w-[600px] h-[600px] bg-pink-300/30 rounded-full blur-[100px] animate-pulse mix-blend-multiply top-[20%] -right-[10%]"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[100px] animate-pulse mix-blend-multiply -bottom-[20%] left-[20%]"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <header className="relative z-10 px-6 py-5 border-b border-white/20 bg-white/50 backdrop-blur-md">
        <Link href="/" className="text-xl font-bold text-slate-800 tracking-tight">
          Studi<span className="text-purple-600">IA</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-2xl"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.5) inset",
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Créer un compte</h1>
            <p className="text-slate-500 text-sm">
              Rejoins des milliers d&apos;étudiants qui révisent mieux.
            </p>
          </div>

          <button
            type="button"
            className="w-full py-3 px-4 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 mb-6"
            onClick={() => alert("OAuth Google disponible prochainement.")}
          >
            <IconGoogle /> Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              ou avec ton email
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {errors.global && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold p-4 rounded-xl mb-6 flex items-center gap-2">
              <span>⚠️</span> {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 relative z-50">
            <div>
              <label
                htmlFor="reg-nom"
                className="block font-semibold text-sm text-slate-700 mb-1.5"
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
                className={`w-full px-4 py-3 rounded-xl text-slate-800 text-sm bg-white border ${
                  errors.nom
                    ? "border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                } focus:outline-none focus:ring-4 transition-all`}
              />
              {errors.nom && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nom}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block font-semibold text-sm text-slate-700 mb-1.5"
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
                className={`w-full px-4 py-3 rounded-xl text-slate-800 text-sm bg-white border ${
                  errors.email
                    ? "border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                } focus:outline-none focus:ring-4 transition-all`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block font-semibold text-sm text-slate-700 mb-1.5"
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
                className={`w-full px-4 py-3 rounded-xl text-slate-800 text-sm bg-white border ${
                  errors.password
                    ? "border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                } focus:outline-none focus:ring-4 transition-all`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>
              )}
              {!errors.password && password.length > 0 && (
                <div className="mt-2 flex gap-1.5">
                  {[1, 2, 3].map((l) => (
                    <div
                      key={l}
                      className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        background:
                          password.length >= l * 4
                            ? password.length >= 10
                              ? "#10B981"
                              : "#F59E0B"
                            : "#E2E8F0",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Création du compte…" : "S'inscrire"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Déjà un compte ?{" "}
            <Link
              href="/connexion"
              className="text-purple-600 hover:text-purple-700 hover:underline"
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          Chargement...
        </div>
      }
    >
      <InscriptionContent />
    </Suspense>
  );
}
