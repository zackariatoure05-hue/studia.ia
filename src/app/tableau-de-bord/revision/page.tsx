"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Skeleton } from "@/components/ui/Skeleton";

function RevisionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coursId = searchParams.get("coursId");
  const matiereId = searchParams.get("matiereId");

  const { flashcards, cours, updateFlashcardStatus, isLoading } = useData();

  // Filter flashcards based on URL params
  const cardsToReview = useMemo(() => {
    let filtered = flashcards;
    if (coursId) {
      filtered = flashcards.filter((f) => f.cours_id === coursId);
    } else if (matiereId) {
      const coursIds = cours.filter((c) => c.matiere_id === matiereId).map((c) => c.id);
      filtered = flashcards.filter((f) => coursIds.includes(f.cours_id));
    }
    // Only review cards that are not "maitrisee" (or we can review all for the demo, let's just take them all so there's always something to review)
    return filtered.sort(() => Math.random() - 0.5); // Shuffle
  }, [flashcards, cours, coursId, matiereId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ known: 0, total: 0 });

  const currentCard = cardsToReview[currentIndex];
  const isFinished = currentIndex >= cardsToReview.length && cardsToReview.length > 0;

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const handleAnswer = (knewIt: boolean) => {
    if (!currentCard) return;

    // Update status in context
    updateFlashcardStatus(currentCard.id, knewIt ? "maitrisee" : "en_cours");

    // Update local score
    setScore((s) => ({ known: s.known + (knewIt ? 1 : 0), total: s.total + 1 }));

    // Go to next card after a tiny delay for smoothness
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((idx) => idx + 1);
    }, 150);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore({ known: 0, total: 0 });
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <>
        <Breadcrumb items={[{ label: "Révision des flashcards" }]} />
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 0" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <Skeleton style={{ height: "20px", width: "100px" }} />
              <Skeleton style={{ height: "4px", width: "150px", borderRadius: "2px" }} />
            </div>
            <Skeleton
              style={{ width: "100%", height: "350px", borderRadius: "1rem", marginBottom: "2rem" }}
            />
          </div>
        </div>
      </>
    );
  }

  if (cardsToReview.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "Révision" }]} />
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "3rem", margin: "0 0 1rem" }}>📭</p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
            Aucune flashcard trouvée
          </h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
            Il n'y a pas de flashcards à réviser ici.
          </p>
          <button
            onClick={() => router.push("/tableau-de-bord")}
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retour au tableau de bord
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Révision des flashcards" }]} />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 0" }}>
        {isFinished ? (
          <div style={{ textAlign: "center", animation: "fadeIn 0.4s" }}>
            <p style={{ fontSize: "4rem", margin: "0 0 1rem" }}>🎉</p>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--foreground)",
                margin: "0 0 0.5rem",
              }}
            >
              Session terminée !
            </h1>
            <p
              style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", marginBottom: "2rem" }}
            >
              Vous avez su <strong>{score.known}</strong> cartes sur <strong>{score.total}</strong>.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => router.back()}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "none",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Retour
              </button>
              <button
                onClick={handleRestart}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px oklch(0.511 0.262 276.966 / 0.2)",
                }}
              >
                Recommencer
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>
                Carte {currentIndex + 1} / {cardsToReview.length}
              </span>
              <div style={{ display: "flex", gap: "2px" }}>
                {cardsToReview.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "12px",
                      height: "4px",
                      borderRadius: "2px",
                      background:
                        i < currentIndex
                          ? "var(--primary)"
                          : i === currentIndex
                            ? "oklch(0.7 0.1 276)"
                            : "var(--border)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Carte 3D Flip */}
            <div
              onClick={handleFlip}
              style={{
                width: "100%",
                height: "350px",
                perspective: "1000px",
                cursor: isFlipped ? "default" : "pointer",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Recto (Question) */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: "1rem",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Question
                  </span>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {currentCard?.question}
                  </h2>
                  {!isFlipped && (
                    <p
                      style={{
                        position: "absolute",
                        bottom: "1.5rem",
                        color: "var(--muted-foreground)",
                        fontSize: "0.85rem",
                        animation: "pulse 2s infinite",
                      }}
                    >
                      Cliquez pour voir la réponse
                    </p>
                  )}
                </div>

                {/* Verso (Réponse) */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    background: "oklch(0.97 0.02 276)",
                    border: "1px solid var(--primary)",
                    borderRadius: "1rem",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    transform: "rotateY(180deg)",
                    boxShadow: "0 8px 24px oklch(0.511 0.262 276.966 / 0.15)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Réponse
                  </span>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--foreground)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {currentCard?.reponse}
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action (visibles seulement si retournée) */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                width: "100%",
                opacity: isFlipped ? 1 : 0,
                pointerEvents: isFlipped ? "auto" : "none",
                transform: isFlipped ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.3s ease",
                transitionDelay: isFlipped ? "0.4s" : "0s",
              }}
            >
              <button
                onClick={() => handleAnswer(false)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  background: "#fff",
                  color: "oklch(0.6 0.2 27)",
                  border: "1px solid oklch(0.6 0.2 27)",
                  borderRadius: "var(--radius)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>😔</span>
                Je ne savais pas
              </button>

              <button
                onClick={() => handleAnswer(true)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  background: "oklch(0.6 0.2 150)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  boxShadow: "0 4px 12px oklch(0.6 0.2 150 / 0.3)",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🤩</span>
                Je savais !
              </button>
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `,
        }}
      />
    </>
  );
}

export default function RevisionPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RevisionContent />
    </Suspense>
  );
}
