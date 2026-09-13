"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { useAuth, PLAN_LABELS } from "@/contexts/AuthContext";
import { useRecording } from "@/contexts/RecordingContext";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { AlertCircle } from "lucide-react";

import { MOCK_MATIERES, MOCK_FACULTES } from "@/lib/fake-data";

type ApiSubject = { id: string; nom: string; couleur: string };

export default function NouveauCoursPage() {
  const router = useRouter();
  const { addCoursTexte, addCoursAudio } = useData();
  const { user, audioLimitMinutes, audioRemainingMinutes, addAudioMinutes } = useAuth();

  const [mode, setMode] = useState<"texte" | "audio">("texte");
  const [titre, setTitre] = useState("");
  const [matiereId, setMatiereId] = useState("");

  // Subjects from the user's faculty (loaded from API)
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [facultyName, setFacultyName] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Texte state
  const [contenu, setContenu] = useState("");

  // Audio state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    isRecording,
    isPaused,
    recordingTime,
    transcription,
    interimTranscription,
    recordedAudioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useRecording();

  // Loader state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<"transcription" | "analyse" | null>(null);

  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  // Load subjects from the user's faculty via API
  useEffect(() => {
    const fid = user?.faculteId;
    if (!fid) return;
    setLoadingSubjects(true);
    fetch(`/api/faculties/${fid}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !data.error && data.subjects?.length > 0) {
          setSubjects(data.subjects);
          setFacultyName(data.nom ?? "");
        } else {
          // Fallback: use mock data
          const mockFaculty = MOCK_FACULTES.find((f) => f.id === fid);
          const mockSubjects = MOCK_MATIERES.filter((m) => m.faculte_id === fid);
          setSubjects(mockSubjects.map((m) => ({ id: m.id, nom: m.nom, couleur: m.couleur })));
          setFacultyName(mockFaculty?.nom ?? "");
        }
      })
      .catch(() => {
        // Fallback on error
        const mockFaculty = MOCK_FACULTES.find((f) => f.id === fid);
        const mockSubjects = MOCK_MATIERES.filter((m) => m.faculte_id === fid);
        setSubjects(mockSubjects.map((m) => ({ id: m.id, nom: m.nom, couleur: m.couleur })));
        setFacultyName(mockFaculty?.nom ?? "");
      })
      .finally(() => setLoadingSubjects(false));
  }, [user?.faculteId]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const downloadTranscription = async () => {
    if (!transcription) return;
    setDownloadingPdf(true);
    try {
      const filename = `Transcription_${titre.trim() || "cours"}`;
      // Build a styled HTML element to render as PDF
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="font-family: Georgia, serif; max-width: 750px; margin: 0 auto; padding: 40px; color: #1a1a1a;">
          <h1 style="font-size: 22px; font-weight: 800; margin-bottom: 6px; color: #2d1b69;">${titre.trim() || "Transcription"}</h1>
          <p style="font-size: 12px; color: #666; margin-bottom: 28px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">
            Généré le ${new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })} · Studia
          </p>
          <div style="font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${transcription.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>`;
      document.body.appendChild(el);

      // @ts-ignore — html2pdf.js has no perfect types
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [10, 15, 10, 15],
          filename: `${filename}.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .save();

      document.body.removeChild(el);
    } catch (err) {
      console.error("PDF generation failed", err);
      // Fallback: plain text
      const blob = new Blob([transcription], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transcription_${titre.trim() || "cours"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const downloadAudio = () => {
    if (!recordedAudioBlob) return;
    const url = URL.createObjectURL(recordedAudioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audio_${titre.trim() || "cours"}.webm`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke after a short delay so the browser has time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      setErrorModal({ isOpen: true, message: "Veuillez déposer un fichier audio valide." });
    }
  };

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!titre.trim()) {
      setErrorModal({ isOpen: true, message: "Veuillez entrer un titre pour votre cours." });
      return;
    }
    if (!matiereId) {
      setErrorModal({ isOpen: true, message: "Veuillez sélectionner une matière." });
      return;
    }
    if (mode === "texte" && !contenu.trim()) {
      setErrorModal({ isOpen: true, message: "Veuillez coller le contenu de votre cours." });
      return;
    }
    if (mode === "audio" && !audioFile && !isRecording && !transcription.trim()) {
      setErrorModal({ isOpen: true, message: "Veuillez enregistrer ou importer un fichier audio." });
      return;
    }

    // Si l'enregistrement est en cours, on l'arrête au moment de générer
    if (isRecording) {
      stopRecording();
    }

    setLoading(true);

    try {
      setLoadingStep("analyse");

      const texteAAnalyser =
        mode === "audio"
          ? transcription.trim() ||
            (audioFile
              ? "Transcription simulée à partir d'un fichier importé. Le système nerveux central est le centre de commande. Il traite les informations."
              : "")
          : contenu.trim();

      const matiereNom = subjects.find((m: ApiSubject) => m.id === matiereId)?.nom || "";
      const plan = user?.plan || "gratuit";

      // Appel de notre API d'IA
      const aiResponse = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: titre.trim(),
          matiere: matiereNom,
          transcription: texteAAnalyser,
          plan: plan,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error("Erreur lors de la génération IA");
      }

      const aiGenerated = await aiResponse.json();

      let newCours;
      if (mode === "audio") {
        // Track used audio minutes
        if (recordingTime > 0) {
          addAudioMinutes(Math.ceil(recordingTime / 60));
        }

        newCours = addCoursAudio(
          matiereId,
          titre.trim(),
          texteAAnalyser,
          recordingTime || 120,
          aiGenerated
        );
      } else {
        newCours = addCoursTexte(matiereId, titre.trim(), contenu.trim(), aiGenerated);
      }

      router.push(`/tableau-de-bord/cours/${newCours.id}`);
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: "Une erreur s'est produite lors de la génération. Veuillez réessayer." });
      setLoading(false);
      setLoadingStep(null);
    }
  }

  return (
    <div className="animate-page-enter">
      <Breadcrumb items={[{ label: "Nouveau cours" }]} />

      <div style={{ marginBottom: "2rem" }} className="animate-fade-in delay-100">
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
            margin: 0,
          }}
        >
          Ajouter un cours
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
          L&apos;IA va analyser ton cours pour créer un résumé et des flashcards.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => setMode("texte")}
          style={{
            padding: "0.6rem 1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderBottom: mode === "texte" ? "2px solid var(--primary)" : "2px solid transparent",
            color: mode === "texte" ? "var(--primary)" : "var(--muted-foreground)",
            transition: "all 0.1s",
          }}
        >
          📄 Texte collé
        </button>
        <button
          onClick={() => setMode("audio")}
          style={{
            padding: "0.6rem 1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderBottom: mode === "audio" ? "2px solid var(--primary)" : "2px solid transparent",
            color: mode === "audio" ? "var(--primary)" : "var(--muted-foreground)",
            transition: "all 0.1s",
          }}
        >
          🎙️ Audio (Enregistrement / Fichier)
        </button>
      </div>

      <form
        onSubmit={handleGenerate}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="titre"
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Titre du cours
            </label>
            <input
              id="titre"
              type="text"
              required
              placeholder="Ex : Introduction à la microéconomie"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
                background: loading ? "var(--muted)" : "#fff",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="matiere"
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Matière
              {facultyName && (
                <span
                  style={{
                    fontWeight: 400,
                    color: "var(--muted-foreground)",
                    marginLeft: "0.4rem",
                  }}
                >
                  · {facultyName}
                </span>
              )}
            </label>
            <select
              id="matiere"
              required
              value={matiereId}
              onChange={(e) => setMatiereId(e.target.value)}
              disabled={loading || loadingSubjects}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
                background: loading || loadingSubjects ? "var(--muted)" : "#fff",
                color: matiereId ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              <option value="" disabled>
                {loadingSubjects
                  ? "Chargement..."
                  : subjects.length === 0 && !user?.faculteId
                    ? "Configurer ta faculté d'abord"
                    : "Sélectionne une matière..."}
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id} style={{ color: "var(--foreground)" }}>
                  {s.nom}
                </option>
              ))}
            </select>
            {!user?.faculteId && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  marginTop: "0.35rem",
                }}
              >
                <a
                  href="/tableau-de-bord/parametres"
                  style={{ color: "var(--primary)", textDecoration: "underline" }}
                >
                  Configure ta faculté
                </a>{" "}
                pour voir tes matières.
              </p>
            )}
          </div>
        </div>

        {mode === "texte" ? (
          <div style={{ animation: "fadeIn 0.2s" }}>
            <label
              htmlFor="contenu"
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Contenu du cours
            </label>
            <textarea
              id="contenu"
              required={mode === "texte"}
              placeholder="Colle ton cours complet ici..."
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              disabled={loading}
              rows={15}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                resize: "vertical",
                background: loading ? "var(--muted)" : "#fff",
              }}
            />
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.2s" }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
              <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--foreground)" }}>
                Source audio
              </label>
              {user && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                    Plan <strong>{PLAN_LABELS[user.plan]}</strong> ·{" "}
                    {audioLimitMinutes === Infinity ? (
                      <span style={{ color: "oklch(0.5 0.2 150)", fontWeight: 700 }}>
                        Illimitée
                      </span>
                    ) : audioRemainingMinutes <= 0 ? (
                      <span style={{ color: "oklch(0.577 0.245 27)", fontWeight: 700 }}>
                        Quota épuisé
                      </span>
                    ) : (
                      <span
                        style={{
                          color:
                            audioRemainingMinutes <= 5 ? "oklch(0.6 0.2 50)" : "oklch(0.5 0.2 150)",
                          fontWeight: 700,
                        }}
                      >
                        {audioRemainingMinutes} min restantes
                      </span>
                    )}
                  </span>
                  {audioLimitMinutes !== Infinity && audioRemainingMinutes <= 5 && (
                    <Link
                      href="/tarifs"
                      style={{
                        fontSize: "0.75rem",
                        background: "var(--primary)",
                        color: "#fff",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      Upgrader
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Quota épuisé banner */}
            {user && audioLimitMinutes !== Infinity && audioRemainingMinutes <= 0 && (
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 mb-4"
                style={{
                  background: "oklch(0.97 0.02 27)",
                  border: "1px solid oklch(0.85 0.1 27)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "oklch(0.5 0.2 27)",
                      margin: 0,
                      fontSize: "0.9rem",
                    }}
                  >
                    ⚠️ Quota de transcription épuisé ce mois-ci
                  </p>
                  <p
                    style={{
                      color: "var(--muted-foreground)",
                      margin: "0.2rem 0 0",
                      fontSize: "0.82rem",
                    }}
                  >
                    Vous avez utilisé {user.audioUsedMinutes} min sur {audioLimitMinutes} min (
                    {PLAN_LABELS[user.plan]}).
                  </p>
                </div>
                <Link
                  href="/tarifs"
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius)",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Changer de plan
                </Link>
              </div>
            )}

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                padding: "2rem",
                textAlign: "center",
                background: isDragging ? "oklch(0.97 0.02 276)" : "#fff",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {audioFile ? (
                <div
                  style={{
                    padding: "1rem",
                    background: "oklch(0.96 0.02 200)",
                    borderRadius: "var(--radius)",
                    color: "oklch(0.38 0.15 200)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <span style={{ fontWeight: 600 }}>{audioFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setAudioFile(null)}
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.75rem",
                      background: "none",
                      border: "none",
                      color: "inherit",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Retirer le fichier
                  </button>
                </div>
              ) : (
                <>
                  {/* Icône micro animée */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: isRecording
                          ? isPaused
                            ? "oklch(0.88 0 0)"
                            : "oklch(0.77 0.17 73)"
                          : "var(--muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: isRecording && !isPaused ? "pulse-ul 1.5s infinite" : "none",
                        transition: "background 0.3s",
                        boxShadow:
                          isRecording && !isPaused ? "0 0 0 0 oklch(0.77 0.17 73 / 0.5)" : "none",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={
                          isRecording
                            ? isPaused
                              ? "oklch(0.4 0 0)"
                              : "oklch(0.12 0 0)"
                            : "var(--muted-foreground)"
                        }
                        strokeWidth={isRecording ? 2.5 : 1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>

                    {/* Chrono + statut */}
                    <div
                      style={{
                        marginTop: "0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          color: isRecording
                            ? isPaused
                              ? "oklch(0.4 0 0)"
                              : "oklch(0.12 0 0)"
                            : "var(--muted-foreground)",
                          fontVariantNumeric: "tabular-nums",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {formatTime(recordingTime)}
                      </span>
                      {isRecording && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: isPaused ? "oklch(0.5 0 0)" : "oklch(0.5 0.18 73)",
                            background: isPaused ? "oklch(0.93 0 0)" : "oklch(0.95 0.06 73)",
                            padding: "0.15rem 0.6rem",
                            borderRadius: "999px",
                          }}
                        >
                          {isPaused ? "⏸ En pause" : "● En cours"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Boutons contrôle */}
                  {!isRecording ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={startRecording}
                        disabled={loading}
                        style={{
                          padding: "0.55rem 1.4rem",
                          background: "oklch(0.12 0 0)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "var(--radius)",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        🎙️ Enregistrer
                      </button>
                      <label
                        style={{
                          padding: "0.55rem 1.25rem",
                          background: "#fff",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius)",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        📁 Importer
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setAudioFile(e.target.files[0]);
                          }}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.6rem",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {isPaused ? (
                        <button
                          type="button"
                          onClick={resumeRecording}
                          style={{
                            padding: "0.5rem 1.2rem",
                            background: "oklch(0.77 0.17 73)",
                            color: "oklch(0.12 0 0)",
                            border: "none",
                            borderRadius: "var(--radius)",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: "0.88rem",
                          }}
                        >
                          ▶ Reprendre
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={pauseRecording}
                          style={{
                            padding: "0.5rem 1.2rem",
                            background: "oklch(0.12 0 0)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "var(--radius)",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: "0.88rem",
                          }}
                        >
                          ⏸ Pause
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={stopRecording}
                        style={{
                          padding: "0.5rem 1.2rem",
                          background: "#fff",
                          color: "oklch(0.577 0.245 27.325)",
                          border: "1px solid oklch(0.9 0.1 27)",
                          borderRadius: "var(--radius)",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "0.88rem",
                        }}
                      >
                        ■ Arrêter
                      </button>
                    </div>
                  )}

                  {!isRecording && (
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", margin: 0 }}>
                      Glissez-déposez votre fichier audio ici
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Zone d'affichage de la transcription en direct */}
            {(isRecording || transcription || interimTranscription) && (
              <div style={{ marginTop: "1.5rem", animation: "fadeIn 0.2s" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    marginBottom: "0.5rem",
                    color: "var(--foreground)",
                  }}
                >
                  Transcription en direct
                </label>
                <div
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    minHeight: "100px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    background: "#fff",
                    color: "var(--foreground)",
                    lineHeight: "1.5",
                  }}
                >
                  {!transcription && !interimTranscription && isRecording ? (
                    <span style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>
                      Écoute en cours... Parlez maintenant.
                    </span>
                  ) : (
                    <>
                      {transcription}
                      <span style={{ color: "var(--primary)" }}>{interimTranscription}</span>
                    </>
                  )}
                </div>

                {!isRecording && transcription && (
                  <div
                    style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}
                  >
                    <button
                      type="button"
                      onClick={downloadTranscription}
                      disabled={downloadingPdf}
                      style={{
                        padding: "0.5rem 1rem",
                        background: downloadingPdf ? "var(--muted)" : "#fff",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: downloadingPdf ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        opacity: downloadingPdf ? 0.7 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      {downloadingPdf ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            style={{ animation: "spin 1s linear infinite" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Génération PDF...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                          📄 Télécharger PDF
                        </>
                      )}
                    </button>

                    {recordedAudioBlob && (
                      <button
                        type="button"
                        onClick={downloadAudio}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#fff",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius)",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 19.5V15m6 4.5v-4.5M9 9l3 3 3-3m-3 3V3m-7.5 18h15"
                          />
                        </svg>
                        🎙️ Télécharger l&apos;audio
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {loading ? (
            <div
              style={{
                width: "100%",
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                <span>
                  {loadingStep === "transcription"
                    ? "Transcription en cours..."
                    : "Analyse par l'IA..."}
                </span>
                <span
                  style={{ color: "var(--muted-foreground)", animation: "pulse 1.5s infinite" }}
                >
                  En cours
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "var(--muted)",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "var(--primary)",
                    width: loadingStep === "transcription" ? "40%" : "90%",
                    transition: "width 2s ease-in-out",
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.7rem 1.5rem",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                boxShadow: "0 4px 12px oklch(0.511 0.262 276.966 / 0.2)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Générer le résumé et les flashcards
            </button>
          )}
        </div>
      </form>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 oklch(0.6 0.2 27 / 0.7); }
          70% { box-shadow: 0 0 0 10px oklch(0.6 0.2 27 / 0); }
          100% { box-shadow: 0 0 0 0 oklch(0.6 0.2 27 / 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `,
        }}
      />
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        title="Attention"
        icon={<AlertCircle className="w-6 h-6" />}
      >
        <p className="text-slate-600 font-medium mb-4">{errorModal.message}</p>
        <div className="flex justify-end">
          <button
            onClick={() => setErrorModal({ isOpen: false, message: "" })}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Compris
          </button>
        </div>
      </Modal>
    </div>
  );
}
