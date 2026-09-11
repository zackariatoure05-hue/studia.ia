"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MatiereDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { facultes, matieres, cours, addCours, deleteCours, isLoading } = useData();

  const matiere = matieres.find((m) => m.id === id);
  const faculte = matiere ? facultes.find((f) => f.id === matiere.faculte_id) : undefined;

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"texte_colle" | "audio">("texte_colle");

  if (isLoading) {
    return (
      <>
        <Breadcrumb items={[{ label: "Facultés", href: "/tableau-de-bord/facultes" }, { label: "Chargement..." }]} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <Skeleton style={{ height: "30px", width: "200px", marginBottom: "0.25rem" }} />
            <Skeleton style={{ height: "15px", width: "100px" }} />
          </div>
          <Skeleton style={{ height: "36px", width: "140px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Skeleton style={{ height: "60px" }} />
          <Skeleton style={{ height: "60px" }} />
          <Skeleton style={{ height: "60px" }} />
        </div>
      </>
    );
  }

  if (!matiere || !faculte) {
    return (
      <>
        <Breadcrumb items={[{ label: "Facultés", href: "/tableau-de-bord/facultes" }, { label: "Matière introuvable" }]} />
        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}>😕</p>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", margin: "0 0 0.5rem" }}>
            Matière introuvable
          </p>
          <button onClick={() => router.push("/tableau-de-bord/facultes")} style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: "var(--radius)", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            ← Retour aux facultés
          </button>
        </div>
      </>
    );
  }

  const coursList = cours.filter((c) => c.matiere_id === id);

  function handleAdd() {
    const title = newTitle.trim();
    if (!title) return;
    const newCours = addCours(id, title, newType);
    setNewTitle("");
    setNewType("texte_colle");
    setShowAdd(false);
    router.push(`/tableau-de-bord/cours/${newCours.id}`);
  }

  function handleDelete(coursId: string, titre: string) {
    if (!confirm(`Supprimer le cours « ${titre} » ?`)) return;
    deleteCours(coursId);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <>
      <Breadcrumb items={[
        { label: "Facultés", href: "/tableau-de-bord/facultes" },
        { label: faculte.nom, href: `/tableau-de-bord/facultes/${faculte.id}` },
        { label: matiere.nom },
      ]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--foreground)", margin: 0 }}>
            {matiere.nom}
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            {coursList.length} cours · {faculte.nom}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1.1rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau cours
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showAdd && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "calc(var(--radius) + 2px)", padding: "1.25rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.3rem", color: "var(--foreground)" }}>
                Titre du cours
              </label>
              <input
                autoFocus
                placeholder="Ex : Le système nerveux central…"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowAdd(false); }}
                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.3rem", color: "var(--foreground)" }}>
                Type
              </label>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                {(["texte_colle", "audio"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewType(t)}
                    style={{
                      padding: "0.45rem 0.9rem",
                      borderRadius: "var(--radius)",
                      border: newType === t ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: newType === t ? "oklch(0.94 0.04 276)" : "#fff",
                      fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                      color: newType === t ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {t === "texte_colle" ? "📄 Texte" : "🎙️ Audio"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleAdd} style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                Ajouter
              </button>
              <button onClick={() => { setShowAdd(false); setNewTitle(""); }} style={{ padding: "0.5rem 0.75rem", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.85rem", cursor: "pointer", color: "var(--muted-foreground)" }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des cours */}
      {coursList.length === 0 ? (
        <div style={{ padding: "3rem 2rem", textAlign: "center", border: "2px dashed var(--border)", borderRadius: "calc(var(--radius) + 4px)" }}>
          <p style={{ fontSize: "2.5rem", margin: "0 0 0.75rem" }}>📄</p>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", margin: "0 0 0.5rem" }}>
            Aucun cours dans cette matière
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", margin: "0 0 1.25rem" }}>
            Ajoute ton premier cours pour générer un résumé et des flashcards.
          </p>
          <button onClick={() => setShowAdd(true)} style={{ padding: "0.6rem 1.5rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            + Ajouter un cours
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 80px", gap: "1rem", padding: "0.5rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <span>Titre</span>
            <span>Type</span>
            <span>Date</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>

          {coursList.map((c) => (
            <div key={c.id} onClick={() => router.push(`/tableau-de-bord/cours/${c.id}`)} style={{
              display: "grid", gridTemplateColumns: "1fr 90px 120px 80px", gap: "1rem",
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "calc(var(--radius) + 2px)",
              padding: "0.85rem 1.25rem", alignItems: "center",
              cursor: "pointer",
              transition: "box-shadow 0.15s, border-color 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              {/* Titre */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
                  {c.type === "audio" ? "🎙️" : "📄"}
                </span>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.titre}
                </p>
              </div>

              {/* Type */}
              <span style={{
                padding: "0.18rem 0.6rem", borderRadius: 999,
                fontSize: "0.72rem", fontWeight: 700,
                background: c.type === "audio" ? "oklch(0.94 0.04 200)" : "oklch(0.94 0.04 276)",
                color: c.type === "audio" ? "oklch(0.38 0.15 200)" : "var(--primary)",
                display: "inline-block", width: "fit-content",
              }}>
                {c.type === "audio" ? "Audio" : "Texte"}
              </span>

              {/* Date */}
              <span style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                {formatDate(c.cree_le)}
              </span>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(c.id, c.titre); }}
                  title="Supprimer"
                  style={{ background: "none", border: "1px solid oklch(0.9 0.1 27)", borderRadius: "var(--radius)", padding: "0.3rem 0.45rem", cursor: "pointer", color: "oklch(0.577 0.245 27.325)", display: "flex", alignItems: "center" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
