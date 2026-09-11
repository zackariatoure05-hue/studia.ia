"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default function FacultesPage() {
  const router = useRouter();
  const { facultes, matieres, addFaculte, renameFaculte, deleteFaculte } = useData();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addFaculte(name, "bg-indigo-500");
    setNewName("");
    setShowAdd(false);
  }

  function startEdit(id: string, currentName: string) {
    setEditingId(id);
    setEditName(currentName);
  }

  function handleRename(id: string) {
    const name = editName.trim();
    if (!name) return;
    renameFaculte(id, name);
    setEditingId(null);
  }

  function handleDelete(id: string, nom: string) {
    if (!confirm(`Supprimer la faculté « ${nom} » et toutes ses matières et cours ?`)) return;
    deleteFaculte(id);
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Facultés" }]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--foreground)", margin: 0 }}>
            Mes facultés
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            {facultes.length} faculté{facultes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.5rem 1.1rem",
            background: "var(--primary)", color: "#fff",
            border: "none", borderRadius: "var(--radius)",
            fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle faculté
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showAdd && (
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: "calc(var(--radius) + 2px)",
          padding: "1rem 1.25rem", marginBottom: "1rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <input
            autoFocus
            placeholder="Nom de la faculté…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowAdd(false); }}
            style={{
              flex: 1, padding: "0.5rem 0.75rem",
              border: "1px solid var(--border)", borderRadius: "var(--radius)",
              fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
            }}
          />
          <button onClick={handleAdd} style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
            Ajouter
          </button>
          <button onClick={() => { setShowAdd(false); setNewName(""); }} style={{ padding: "0.5rem 0.75rem", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.85rem", cursor: "pointer", color: "var(--muted-foreground)" }}>
            Annuler
          </button>
        </div>
      )}

      {/* Liste */}
      {facultes.length === 0 ? (
        <div style={{
          padding: "3rem 2rem", textAlign: "center",
          border: "2px dashed var(--border)", borderRadius: "calc(var(--radius) + 4px)",
        }}>
          <p style={{ fontSize: "2.5rem", margin: "0 0 0.75rem" }}>🏛️</p>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", margin: "0 0 0.5rem" }}>
            Aucune faculté pour l&apos;instant
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", margin: "0 0 1.25rem" }}>
            Crée ta première faculté pour commencer à organiser tes cours.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            style={{ padding: "0.6rem 1.5rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
          >
            + Créer une faculté
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {facultes.map((fac) => {
            const count = matieres.filter((m) => m.faculte_id === fac.id).length;
            const isEditing = editingId === fac.id;

            return (
              <div key={fac.id} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: "calc(var(--radius) + 2px)",
                padding: "1rem 1.25rem",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
              }}>
                <div
                  onClick={() => !isEditing && router.push(`/tableau-de-bord/facultes/${fac.id}`)}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, cursor: isEditing ? "default" : "pointer", minWidth: 0 }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "oklch(0.93 0.04 276)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                    🏛️
                  </div>
                  <div style={{ minWidth: 0 }}>
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleRename(fac.id); if (e.key === "Escape") setEditingId(null); }}
                        onBlur={() => handleRename(fac.id)}
                        style={{ fontWeight: 700, fontSize: "0.9rem", border: "1px solid var(--primary)", borderRadius: "var(--radius)", padding: "0.25rem 0.5rem", outline: "none", width: "100%", boxSizing: "border-box" }}
                      />
                    ) : (
                      <p style={{ fontWeight: 700, fontSize: "0.9rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {fac.nom}
                      </p>
                    )}
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", margin: "0.1rem 0 0" }}>
                      {count} matière{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(fac.id, fac.nom)}
                      title="Renommer"
                      style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.35rem 0.5rem", cursor: "pointer", color: "var(--muted-foreground)", display: "flex", alignItems: "center" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(fac.id, fac.nom)}
                    title="Supprimer"
                    style={{ background: "none", border: "1px solid oklch(0.9 0.1 27)", borderRadius: "var(--radius)", padding: "0.35rem 0.5rem", cursor: "pointer", color: "oklch(0.577 0.245 27.325)", display: "flex", alignItems: "center" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => router.push(`/tableau-de-bord/facultes/${fac.id}`)}
                    title="Voir"
                    style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.35rem 0.5rem", cursor: "pointer", color: "var(--muted-foreground)", display: "flex", alignItems: "center" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
