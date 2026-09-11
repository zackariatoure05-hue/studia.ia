"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Skeleton } from "@/components/ui/Skeleton";
import { Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Palette de surlignage qui alterne
const HIGHLIGHT_COLORS = [
  { bg: "oklch(0.97 0.06 95)",  text: "oklch(0.5 0.14 75)",  border: "oklch(0.88 0.1 95)"  },  // jaune
  { bg: "oklch(0.96 0.06 220)", text: "oklch(0.42 0.15 225)", border: "oklch(0.85 0.1 220)" },  // bleu
  { bg: "oklch(0.96 0.06 150)", text: "oklch(0.42 0.15 148)", border: "oklch(0.85 0.1 150)" },  // vert
  { bg: "oklch(0.96 0.06 300)", text: "oklch(0.48 0.18 300)", border: "oklch(0.85 0.1 300)" },  // violet
];

function HighlightedText({ text }: { text: string }) {
  // Met en gras et surligne les mots commençant par une majuscule (noms propres / concepts)
  const parts = text.split(/(\b[A-ZÀ-Ü][a-zà-ü]{3,}\b)/g);
  let colorIdx = 0;
  return (
    <>
      {parts.map((part, i) => {
        if (/^\b[A-ZÀ-Ü][a-zà-ü]{3,}\b$/.test(part)) {
          const c = HIGHLIGHT_COLORS[colorIdx % HIGHLIGHT_COLORS.length];
          colorIdx++;
          return (
            <mark key={i} style={{
              background: c.bg, color: c.text,
              borderRadius: "3px", padding: "0 3px",
              fontWeight: 600,
            }}>{part}</mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const KEY_ICONS = ["💡", "🎯", "📌", "🔑", "⚡", "🧠", "📊", "🔎"];
const KEY_COLORS = [
  { bg: "oklch(0.97 0.04 276)", border: "oklch(0.88 0.08 276)", accent: "var(--primary)" },
  { bg: "oklch(0.97 0.05 150)", border: "oklch(0.88 0.1 150)",  accent: "oklch(0.45 0.18 150)" },
  { bg: "oklch(0.97 0.05 50)",  border: "oklch(0.88 0.1 50)",   accent: "oklch(0.55 0.18 60)"  },
  { bg: "oklch(0.97 0.05 300)", border: "oklch(0.88 0.1 300)",  accent: "oklch(0.5 0.18 300)"  },
];

export default function CoursDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { facultes, matieres, cours, resumes, flashcards, deleteCours, isLoading } = useData();

  const c = cours.find((crs) => crs.id === id);
  const matiere = c ? matieres.find((m) => m.id === c.matiere_id) : undefined;
  const faculte = matiere ? facultes.find((f) => f.id === matiere.faculte_id) : undefined;
  
  const resume = resumes.find(r => r.cours_id === id);
  const fcs = flashcards.filter(f => f.cours_id === id);

  const [activeTab, setActiveTab] = useState<"resume" | "flashcards" | "texte">("resume");
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCard = (fcId: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(fcId)) next.delete(fcId); else next.add(fcId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <>
        <Breadcrumb items={[{ label: "Facultés", href: "/tableau-de-bord/facultes" }, { label: "Chargement..." }]} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <Skeleton style={{ height: "30px", width: "250px", marginBottom: "0.5rem" }} />
            <Skeleton style={{ height: "15px", width: "150px" }} />
          </div>
          <Skeleton style={{ height: "36px", width: "120px" }} />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
          <Skeleton style={{ height: "40px", width: "100px", borderRadius: "8px 8px 0 0" }} />
          <Skeleton style={{ height: "40px", width: "120px", borderRadius: "8px 8px 0 0" }} />
          <Skeleton style={{ height: "40px", width: "140px", borderRadius: "8px 8px 0 0" }} />
        </div>
        <div style={{ maxWidth: "800px" }}>
          <Skeleton style={{ height: "120px", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "200px" }} />
        </div>
      </>
    );
  }

  if (!c || !matiere || !faculte) {
    return (
      <>
        <Breadcrumb items={[{ label: "Cours", href: "/tableau-de-bord" }, { label: "Introuvable" }]} />
        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}>😕</p>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", margin: "0 0 0.5rem" }}>
            Cours introuvable
          </p>
          <button onClick={() => router.push("/tableau-de-bord")} style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: "var(--radius)", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            ← Retour au tableau de bord
          </button>
        </div>
      </>
    );
  }

  function handleDelete() {
    if (!confirm(`Supprimer le cours « ${c!.titre} » ?`)) return;
    deleteCours(c!.id);
    router.push(`/tableau-de-bord/matiere/${matiere!.id}`);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const handleDownloadPDF = () => {
    // Inject print styles
    const styleId = 'pdf-print-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media print {
          body > * { display: none !important; }
          #pdf-print-wrapper { display: block !important; }
          #pdf-print-wrapper { position: fixed; inset: 0; background: white; padding: 24px; font-family: Georgia, serif; }
          #pdf-print-wrapper h1 { font-size: 22pt; font-weight: 900; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 16px; }
          #pdf-print-wrapper h2 { font-size: 16pt; font-weight: 700; margin-top: 20px; margin-bottom: 8px; }
          #pdf-print-wrapper h3 { font-size: 13pt; font-weight: 600; margin-top: 14px; margin-bottom: 6px; }
          #pdf-print-wrapper p  { font-size: 11pt; line-height: 1.7; margin-bottom: 10px; }
          #pdf-print-wrapper ul, #pdf-print-wrapper ol { margin-left: 20px; margin-bottom: 10px; font-size: 11pt; }
          #pdf-print-wrapper li { margin-bottom: 4px; }
          #pdf-print-wrapper strong { font-weight: 700; }
          @page { margin: 20mm; }
        }
      `;
      document.head.appendChild(style);
    }
    // Set title for the PDF filename
    const prevTitle = document.title;
    document.title = `Resume_${c?.titre || 'cours'}`;
    window.print();
    document.title = prevTitle;
  };

  return (
    <div className="animate-page-enter">
      <Breadcrumb items={[
        { label: "Facultés", href: "/tableau-de-bord/facultes" },
        { label: faculte.nom, href: `/tableau-de-bord/facultes/${faculte.id}` },
        { label: matiere.nom, href: `/tableau-de-bord/matiere/${matiere.id}` },
        { label: c.titre },
      ]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
              {c.type === "audio" ? "🎙️" : "📄"}
            </span>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--foreground)", margin: 0 }}>
              {c.titre}
            </h1>
          </div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              padding: "0.15rem 0.5rem", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700,
              background: c.type === "audio" ? "oklch(0.94 0.04 200)" : "oklch(0.94 0.04 276)",
              color: c.type === "audio" ? "oklch(0.38 0.15 200)" : "var(--primary)",
            }}>
              {c.type === "audio" ? "Audio" : "Texte"}
            </span>
            · Ajouté le {formatDate(c.cree_le)}
          </p>
        </div>
        <button
          onClick={handleDelete}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.9rem", background: "none", border: "1px solid oklch(0.9 0.1 27)", color: "oklch(0.577 0.245 27.325)", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
          </svg>
          Supprimer
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
        {(["resume", "flashcards", "texte"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.6rem 1rem",
              background: "none", border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: "0.85rem",
              borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
              color: activeTab === tab ? "var(--primary)" : "var(--muted-foreground)",
              transition: "all 0.15s"
            }}
          >
            {tab === "resume" ? "📝 Résumé" : tab === "flashcards" ? "🃏 Flashcards" : "📄 Texte original"}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: "820px" }}>
        
        {/* ═══ RÉSUMÉ ENRICHI (Cahier & Mindmap) ═══ */}
        {activeTab === "resume" && (
          <div className="notebook-paper" style={{ animation: "fadeIn 0.25s" }}>
            {resume ? (
              <>
                {/* En-tête cahier et Export */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "2px solid rgba(0,0,0,0.1)", paddingBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>🧠</span>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "var(--foreground)", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
                      Synthèse du cours
                    </h3>
                  </div>
                  
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Download size={16} />
                    Télécharger en PDF
                  </button>
                </div>

                {/* Contenu Markdown — affiché à l'écran */}
                <div id="pdf-content" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem", background: "#fff", padding: "1.5rem", borderRadius: "12px" }} className="markdown-content">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-black text-primary mb-4 mt-6 border-b pb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold text-foreground mb-3 mt-5" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-foreground mb-2 mt-4" {...props} />,
                      p: ({node, ...props}) => <p className="text-base text-muted-foreground leading-relaxed mb-4" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground" {...props} />,
                      li: ({node, ...props}) => <li className="ml-4" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                    }}
                  >
                    {resume.contenu}
                  </ReactMarkdown>
                </div>

                {/* Wrapper d'impression — hidden à l'écran, visible lors du print */}
                <div id="pdf-print-wrapper" style={{ display: 'none' }}>
                  <ReactMarkdown>{resume.contenu}</ReactMarkdown>
                </div>

                {/* Points clés — Cartes Mentales (Chemins) */}
                <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>🎯</span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--foreground)" }}>
                    Chemin de Révision (Points Clés)
                  </h3>
                </div>
                
                <div style={{ position: "relative", padding: "1rem 0 2rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                  {resume.points_cles.map((pt, i) => {
                    const icon = KEY_ICONS[i % KEY_ICONS.length];
                    const isEven = i % 2 === 0;
                    
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: isEven ? "flex-start" : "flex-end", position: "relative" }}>
                        
                        {/* Ligne SVG qui relie au point suivant */}
                        {i < resume.points_cles.length - 1 && (
                          <svg className="mindmap-path" style={{
                            width: "50%", height: "4rem",
                            left: isEven ? "25%" : "auto", right: isEven ? "auto" : "25%",
                            top: "100%"
                          }} viewBox="0 0 100 100" preserveAspectRatio="none">
                            {isEven 
                              ? <path d="M10,0 C10,50 90,50 90,100" />
                              : <path d="M90,0 C90,50 10,50 10,100" />
                            }
                          </svg>
                        )}
                        
                        {/* Nœud Mindmap */}
                        <div className="mindmap-node" style={{ width: "70%", maxWidth: "450px" }}>
                          <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                            <span style={{
                              fontSize: "1.3rem", lineHeight: 1,
                              background: "rgba(0,0,0,0.04)", borderRadius: "8px",
                              padding: "0.4rem", flexShrink: 0,
                            }}>{icon}</span>
                            <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.95rem", color: "var(--foreground)", fontWeight: 600 }}>
                              <HighlightedText text={pt} />
                            </p>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem 2rem", background: "rgba(255,255,255,0.5)", borderRadius: "12px", border: "1px dashed rgba(0,0,0,0.2)" }}>
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "1rem", fontStyle: "italic" }}>Aucun résumé rédigé sur ce cahier.</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ FLASHCARDS ═══ */}
        {activeTab === "flashcards" && (
          <div style={{ animation: "fadeIn 0.25s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                {fcs.length} flashcards générées
              </h3>
              <button
                onClick={() => router.push("/tableau-de-bord/revision")}
                style={{ padding: "0.45rem 1rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Réviser maintenant →
              </button>
            </div>
            
            {fcs.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", fontStyle: "italic" }}>Aucune flashcard générée.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {fcs.map((fc, idx) => {
                  const isFlipped = flippedCards.has(fc.id);
                  return (
                    <div
                      key={fc.id}
                      onClick={() => toggleCard(fc.id)}
                      style={{
                        background: "#fff", border: "1px solid var(--border)",
                        borderRadius: "12px", padding: "1.25rem",
                        cursor: "pointer",
                        transition: "transform 0.15s, box-shadow 0.15s",
                        boxShadow: isFlipped ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
                        borderLeft: `4px solid ${isFlipped ? "var(--primary)" : "var(--border)"}`,
                      }}
                      className="card-hover"
                    >
                      <div style={{ marginBottom: isFlipped ? "0.75rem" : 0 }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Question {idx + 1}
                        </span>
                        <p style={{ fontWeight: 600, fontSize: "1rem", color: "var(--foreground)", margin: "0.2rem 0 0" }}>{fc.question}</p>
                      </div>
                      {isFlipped && (
                        <div style={{ paddingTop: "0.75rem", borderTop: "1px dashed var(--border)", animation: "fadeIn 0.2s" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Réponse</span>
                          <p style={{ fontSize: "0.95rem", color: "var(--foreground)", margin: "0.2rem 0 0", lineHeight: 1.55 }}>{fc.reponse}</p>
                        </div>
                      )}
                      {!isFlipped && (
                        <p style={{ margin: "0.5rem 0 0", fontSize: "0.78rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>
                          Cliquer pour voir la réponse
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ TEXTE ORIGINAL ═══ */}
        {activeTab === "texte" && (
          <div style={{ animation: "fadeIn 0.25s" }}>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 1rem", color: "var(--foreground)" }}>Contenu brut</h3>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "var(--foreground)", fontSize: "0.95rem", margin: 0 }}>
                {c.contenu_brut || <span style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>Contenu vide.</span>}
              </p>
            </div>
          </div>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
