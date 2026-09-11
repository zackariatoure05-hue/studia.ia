"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEffect, useState } from "react";
import { BookOpen, Flame, Brain, Award, ChevronRight, Plus } from "lucide-react";

type Subject = { id: string; nom: string; couleur: string };
type Faculty = { id: string; nom: string; couleur: string; icone: string; code: string; subjects: Subject[] };

const PLAN_LABELS: Record<string, string> = {
  gratuit: "Plan Gratuit",
  etudiant: "Plan Étudiant",
  etudiant_plus: "Plan Étudiant+",
};

const PLAN_COLORS: Record<string, string> = {
  gratuit: "oklch(0.55 0.06 276)",
  etudiant: "oklch(0.45 0.18 280)",
  etudiant_plus: "oklch(0.55 0.18 50)",
};

export default function DashboardHome() {
  const router = useRouter();
  const { cours, flashcards, isLoading: dataLoading } = useData();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Charger la faculté depuis l'API dès qu'on a le facultyId de l'user
  useEffect(() => {
    const fid = user?.faculteId; // faculteId = ID de la Faculty globale
    if (!fid) return;
    setLoadingFaculty(true);
    fetch(`/api/faculties/${fid}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && !data.error) setFaculty(data);
      })
      .catch(() => {})
      .finally(() => setLoadingFaculty(false));
  }, [user?.faculteId]);

  if (!mounted) return null;

  const displayName = user?.prenom || user?.nom?.split(" ")[0] || "champion";
  const planLabel = PLAN_LABELS[user?.plan ?? "gratuit"] ?? "Plan Gratuit";
  const planColor = PLAN_COLORS[user?.plan ?? "gratuit"] ?? PLAN_COLORS.gratuit;

  // Stats gamifiées
  const streak = 3;
  const masteredCards = flashcards.filter(f => f.statut === "maitrisee").length;
  const totalCours = cours.length;

  return (
    <div className="animate-page-enter space-y-8">

      {/* ── Bannière de bienvenue ── */}
      <div className="relative overflow-hidden rounded-2xl p-8"
        style={{ background: "linear-gradient(135deg, oklch(0.6 0.15 276), oklch(0.48 0.18 290))" }}>
        {/* Cercles décoratifs */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full opacity-10" style={{ background: "white" }} />

        <div className="relative z-10">
          {/* Plan badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(10px)" }}>
            <Award size={12} />
            {planLabel}
          </span>

          <h1 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
            Prêt à tout déchirer<br />aujourd&apos;hui, {displayName} ? 🚀
          </h1>

          {faculty && (
            <p className="text-white/80 text-sm font-medium mb-6">
              {faculty.icone} {faculty.nom}
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push("/tableau-de-bord/nouveau-cours")}
              className="flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "white", color: "oklch(0.5 0.15 276)", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Ajouter un cours
            </button>
            <button
              onClick={() => router.push("/tableau-de-bord/revision")}
              className="flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(10px)" }}
            >
              🎯 Réviser
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Flame size={22} />, label: "Série actuelle", value: `${streak} jours`, bg: "oklch(0.94 0.05 40)", color: "oklch(0.55 0.18 40)" },
          { icon: <Brain size={22} />, label: "Flashcards maîtrisées", value: masteredCards, bg: "oklch(0.94 0.04 276)", color: "oklch(0.5 0.18 280)" },
          { icon: <BookOpen size={22} />, label: "Cours enregistrés", value: totalCours, bg: "oklch(0.94 0.05 140)", color: "oklch(0.45 0.18 148)" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Ma Faculté & Matières ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-foreground tracking-tight">Mes Matières</h2>
          {faculty && (
            <span className="text-sm text-muted-foreground font-medium">
              {faculty.icone} {faculty.nom}
            </span>
          )}
        </div>

        {(dataLoading || loadingFaculty) ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} style={{ height: "100px", borderRadius: "12px" }} />
            ))}
          </div>
        ) : !faculty ? (
          <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="font-bold text-lg text-foreground mb-1">Aucune faculté sélectionnée</p>
            <p className="text-muted-foreground text-sm mb-4">Complète ton profil pour accéder à tes matières.</p>
            <button
              onClick={() => router.push("/tableau-de-bord/parametres")}
              className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors"
            >
              Configurer mon profil
            </button>
          </div>
        ) : faculty.subjects.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucune matière disponible pour cette faculté.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {faculty.subjects.map((subject, i) => {
              // Courses liées à cette matière (via les Matières locales — données legacy)
              const subjectCours = cours.filter(c => {
                // Pour l'instant on lie par nom similaire — en prod ce sera par subject_id
                return c.matiere_id !== undefined;
              }).length;

              return (
                <div
                  key={subject.id}
                  className="bg-white border border-border rounded-xl p-4 cursor-pointer group hover:shadow-md transition-all hover:-translate-y-0.5"
                  style={{ borderLeft: `4px solid ${faculty.couleur}` }}
                  onClick={() => router.push(`/tableau-de-bord/nouveau-cours`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{ background: `${faculty.couleur}18` }}>
                      📚
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                  </div>
                  <p className="font-bold text-sm text-foreground leading-snug">{subject.nom}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ajouter un cours →</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Derniers cours ── */}
      {cours.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-foreground tracking-tight mb-4">Derniers Cours</h2>
          <div className="flex flex-col gap-2">
            {cours.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="bg-white border border-border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-all group"
                onClick={() => router.push(`/tableau-de-bord/cours/${c.id}`)}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: c.type === "audio" ? "oklch(0.96 0.04 200)" : "oklch(0.96 0.04 276)" }}>
                  {c.type === "audio" ? "🎙️" : "📄"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{c.titre}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.type === "audio" ? "Transcription audio" : "Texte collé"}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
