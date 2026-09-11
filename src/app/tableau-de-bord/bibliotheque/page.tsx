"use client";

import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/navigation";
import { Library, Download, Trash2, ArrowRight, FileText, Headphones } from "lucide-react";
import Markdown from "react-markdown";

export default function BibliothequePage() {
  const { cours, matieres, resumes, deleteCours } = useData();
  const router = useRouter();

  // Trier les cours par date de création (les plus récents en premier)
  const sortedCours = [...cours].sort((a, b) => new Date(b.cree_le).getTime() - new Date(a.cree_le).getTime());

  function getMatiereNom(id: string) {
    return matieres.find(m => m.id === id)?.nom || "Matière inconnue";
  }

  function getResume(coursId: string) {
    return resumes.find(r => r.cours_id === coursId);
  }

  const handleDownloadPDF = (c: any, r: any) => {
    // Rend le markdown en HTML temporaire pour impression
    const wrapper = document.createElement("div");
    wrapper.id = "temp-pdf-wrapper";
    wrapper.style.display = "none";
    document.body.appendChild(wrapper);

    // Injection du style
    const styleId = 'pdf-print-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media print {
          body > * { display: none !important; }
          #temp-pdf-wrapper { display: block !important; }
          #temp-pdf-wrapper { position: fixed; inset: 0; background: white; padding: 24px; font-family: Georgia, serif; }
          #temp-pdf-wrapper h1 { font-size: 22pt; font-weight: 900; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 16px; }
          #temp-pdf-wrapper h2 { font-size: 16pt; font-weight: 700; margin-top: 20px; margin-bottom: 8px; }
          #temp-pdf-wrapper h3 { font-size: 13pt; font-weight: 600; margin-top: 14px; margin-bottom: 6px; }
          #temp-pdf-wrapper p  { font-size: 11pt; line-height: 1.7; margin-bottom: 10px; }
          #temp-pdf-wrapper ul, #temp-pdf-wrapper ol { margin-left: 20px; margin-bottom: 10px; font-size: 11pt; }
          #temp-pdf-wrapper li { margin-bottom: 4px; }
          #temp-pdf-wrapper strong { font-weight: 700; }
          @page { margin: 20mm; }
        }
      `;
      document.head.appendChild(style);
    }

    // Le plus simple pour transformer le Markdown en HTML sans dépendance lourde : on utilise l'API de base
    // Mais comme on a react-markdown, on va tricher : on insère le contenu textuel basique si pas de renderer.
    // Idéalement on créerait un portail React, mais on peut faire simple pour l'impression natif.
    // Pour que ce soit propre, on redirige juste l'utilisateur vers la page cours pour imprimer.
    // Ou bien on génère un blob textuel (un faux PDF).
    // => Vu qu'on a déjà la logique sur la page du cours, on peut déclencher une navigation et l'impression automatique (complexe).
    // Je vais plutôt injecter un bouton qui redirige vers le cours avec un hash #print
    router.push(`/tableau-de-bord/cours/${c.id}`);
  };

  const handleDownloadAudio = (c: any) => {
    if (c.url_audio) {
      const a = document.createElement("a");
      a.href = c.url_audio;
      a.download = `Audio_${c.titre.replace(/\s+/g, "_")}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Ce cours n'a pas d'audio enregistré ou le fichier n'est plus disponible.");
    }
  };

  const handleDelete = (id: string, titre: string) => {
    if (confirm(`Supprimer définitivement le cours "${titre}" et toutes ses flashcards ?`)) {
      deleteCours(id);
    }
  };

  return (
    <div className="animate-page-enter">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Library size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ma bibliothèque</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Historique de tous tes cours, résumés et flashcards.</p>
        </div>
      </div>

      {sortedCours.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-border mt-8">
          <Library size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-lg font-bold mb-2">Ta bibliothèque est vide</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Tu n'as pas encore créé de cours. Commence par enregistrer un cours ou coller tes notes.
          </p>
          <button
            onClick={() => router.push("/tableau-de-bord/nouveau-cours")}
            className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-primary/90 transition-all"
          >
            Nouveau cours
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedCours.map(c => {
            const matiere = getMatiereNom(c.matiere_id);
            const r = getResume(c.id);
            const isAudio = c.type === "audio";

            return (
              <div key={c.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      {matiere}
                    </p>
                    <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2">
                      {c.titre}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {isAudio ? <Headphones size={16} className="text-muted-foreground" /> : <FileText size={16} className="text-muted-foreground" />}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-4 flex-1">
                  Créé le {new Date(c.cree_le).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                </p>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                  <button
                    title="Aller au cours"
                    onClick={() => router.push(`/tableau-de-bord/cours/${c.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Voir <ArrowRight size={16} />
                  </button>
                  
                  {isAudio && (
                    <button
                      title="Télécharger l'audio"
                      onClick={() => handleDownloadAudio(c)}
                      className="w-10 h-10 flex items-center justify-center bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-lg transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  )}

                  <button
                    title="Supprimer"
                    onClick={() => handleDelete(c.id, c.titre)}
                    className="w-10 h-10 flex items-center justify-center bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
