"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import {
  MapPin,
  User as UserIcon,
  Calendar,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  BrainCircuit,
} from "lucide-react";

const AVATARS = [
  {
    id: "socrates",
    name: "Le Professeur Socrate",
    desc: "Philosophique, vous fait trouver la réponse par vous-même.",
    icon: "🏛️",
  },
  {
    id: "einstein",
    name: "Le Génie Structuré",
    desc: "Clair, précis, axé sur la logique et la mémorisation.",
    icon: "🧠",
  },
  {
    id: "chill",
    name: "L'Étudiant Chill",
    desc: "Te parle comme un pote, utilise des exemples simples et fun.",
    icon: "🤙",
  },
  {
    id: "mentor",
    name: "Le Mentor Motivateur",
    desc: "Ne te lâche jamais, toujours là pour te booster avant les partiels.",
    icon: "🔥",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuth();
  const { facultes, addFaculte, addMatiere } = useData();

  const [step, setStep] = useState(1);

  // Step 1: Identity
  const [prenom, setPrenom] = useState(user?.prenom || "");
  const [nom, setNom] = useState(user?.nom || "");
  const [age, setAge] = useState(user?.age || "");
  const [ville, setVille] = useState(user?.ville || "");

  // Step 2: Faculty
  const [selectedFaculteId, setSelectedFaculteId] = useState<string>("");
  const [newFaculteName, setNewFaculteName] = useState("");

  // Step 3: Avatar
  const [avatarId, setAvatarId] = useState(AVATARS[0].id);

  const handleNextToFaculte = () => {
    if (!prenom.trim() || !nom.trim() || !ville.trim()) {
      alert("Prénom, nom et ville sont requis.");
      return;
    }
    setStep(2);
  };

  const handleNextToAvatar = () => {
    if (!selectedFaculteId && !newFaculteName.trim()) {
      alert("Veuillez sélectionner ou créer une faculté.");
      return;
    }
    setStep(3);
  };

  const handleFinish = () => {
    let finalFacId = selectedFaculteId;

    // Si l'utilisateur a tapé une nouvelle faculté
    if (newFaculteName.trim() && !selectedFaculteId) {
      const newFac = addFaculte(newFaculteName.trim(), "#6366f1");
      finalFacId = newFac.id;

      // Ajouter quelques matières par défaut pour ne pas arriver sur une page vide
      addMatiere(newFac.id, "Introduction", "#6366f1");
      addMatiere(newFac.id, "Fondamentaux", "#4ade80");
      addMatiere(newFac.id, "Méthodologie", "#f59e0b");
    }

    completeOnboarding({
      faculteId: finalFacId || "fac_1",
      prenom: prenom.trim(),
      age: age.trim(),
      ville: ville.trim(),
      avatarId,
    });

    // Nouveau flow : Onboarding -> Onboarding Guide
    router.push("/onboarding-guide");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "3rem",
          borderRadius: 24,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
          maxWidth: 600,
          width: "100%",
          border: "1px solid #f1f5f9",
        }}
      >
        {/* PROGRESS BAR */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "3rem" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                background: step >= i ? "var(--primary)" : "#e2e8f0",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "oklch(0.96 0.02 276)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            {step === 1 && <UserIcon className="w-8 h-8" />}
            {step === 2 && <GraduationCap className="w-8 h-8" />}
            {step === 3 && <BrainCircuit className="w-8 h-8" />}
          </div>
          <h1
            style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}
          >
            {step === 1 && "Faisons connaissance 👋"}
            {step === 2 && "Où étudies-tu ? 🏛️"}
            {step === 3 && "Choisis ton Avatar IA 🤖"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            {step === 1 && "L'IA a besoin de te connaître pour adapter son discours."}
            {step === 2 && "Une seule faculté par profil pour rester 100% focus."}
            {step === 3 && "Cet avatar sera ton prof particulier 24h/24."}
          </p>
        </div>

        {/* STEP 1: Identity */}
        {step === 1 && (
          <div className="animate-page-enter">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#475569",
                    marginBottom: "0.5rem",
                  }}
                >
                  Prénom
                </label>
                <div style={{ position: "relative" }}>
                  <UserIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Camille"
                    style={{
                      width: "100%",
                      padding: "0.8rem 0.8rem 0.8rem 2.5rem",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#475569",
                    marginBottom: "0.5rem",
                  }}
                >
                  Nom
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Dupont"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: 12,
                    border: "1px solid #cbd5e1",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#475569",
                    marginBottom: "0.5rem",
                  }}
                >
                  Âge
                </label>
                <div style={{ position: "relative" }}>
                  <Calendar className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="20"
                    style={{
                      width: "100%",
                      padding: "0.8rem 0.8rem 0.8rem 2.5rem",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#475569",
                    marginBottom: "0.5rem",
                  }}
                >
                  Ville d'étude
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="Paris, Lyon..."
                    style={{
                      width: "100%",
                      padding: "0.8rem 0.8rem 0.8rem 2.5rem",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleNextToFaculte}
              style={{
                width: "100%",
                padding: "1rem",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              className="btn-press"
            >
              Suivant <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Faculté */}
        {step === 2 && (
          <div className="animate-page-enter">
            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                marginBottom: "1.5rem",
                maxHeight: 200,
                overflowY: "auto",
                paddingRight: "0.5rem",
              }}
            >
              {facultes.map((fac) => (
                <button
                  key={fac.id}
                  onClick={() => {
                    setSelectedFaculteId(fac.id);
                    setNewFaculteName("");
                  }}
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    background: selectedFaculteId === fac.id ? "oklch(0.96 0.02 276)" : "#fff",
                    color: selectedFaculteId === fac.id ? "var(--primary)" : "#0f172a",
                    border: `2px solid ${selectedFaculteId === fac.id ? "var(--primary)" : "#e2e8f0"}`,
                    borderRadius: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {fac.nom}
                  {selectedFaculteId === fac.id && <CheckCircle2 className="w-5 h-5" />}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#475569",
                }}
              >
                Autre faculté (non listée) :
              </label>
              <input
                type="text"
                value={newFaculteName}
                onChange={(e) => {
                  setNewFaculteName(e.target.value);
                  setSelectedFaculteId("");
                }}
                placeholder="Ex: Faculté des Sciences"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <button
              onClick={handleNextToAvatar}
              style={{
                width: "100%",
                padding: "1rem",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              className="btn-press"
            >
              Suivant <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 3: Avatar */}
        {step === 3 && (
          <div className="animate-page-enter">
            <div style={{ display: "grid", gap: "1rem", marginBottom: "2.5rem" }}>
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setAvatarId(avatar.id)}
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    background: avatarId === avatar.id ? "oklch(0.96 0.02 276)" : "#fff",
                    border: `2px solid ${avatarId === avatar.id ? "var(--primary)" : "#e2e8f0"}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{ fontSize: "2rem", lineHeight: 1 }}>{avatar.icon}</div>
                  <div>
                    <h3
                      style={{
                        margin: "0 0 0.2rem",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: avatarId === avatar.id ? "var(--primary)" : "#0f172a",
                      }}
                    >
                      {avatar.name}
                    </h3>
                    <p
                      style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", lineHeight: 1.4 }}
                    >
                      {avatar.desc}
                    </p>
                  </div>
                  {avatarId === avatar.id && (
                    <Sparkles className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleFinish}
              style={{
                width: "100%",
                padding: "1rem",
                background: "linear-gradient(135deg, oklch(0.6 0.15 276), oklch(0.5 0.25 290))",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 10px 25px oklch(0.6 0.15 276 / 0.4)",
              }}
              className="btn-press"
            >
              Finaliser l'inscription <Sparkles className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
