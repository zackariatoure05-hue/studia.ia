"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default function ParametresPage() {
  const { user, logout, updateUser } = useAuth();
  const { facultes } = useData();
  const [nom, setNom] = useState(user?.nom ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [faculteId, setFaculteId] = useState(user?.faculteId ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (faculteId && user?.faculteId !== faculteId) {
      updateUser({ faculteId });
      setSaved(true);
    }
    setTimeout(() => setSaved(false), 3000);
  }

  const SECTION_STYLE: React.CSSProperties = {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1.75rem",
    marginBottom: "1.5rem",
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Paramètres" }]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--foreground)", margin: 0 }}>
            Paramètres
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            Gérez votre profil et vos préférences
          </p>
        </div>
      </div>

      {/* Profil */}
      <div style={SECTION_STYLE}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1.25rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          👤 Informations personnelles
        </h2>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 480 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.4rem", color: "var(--foreground)" }}>Nom</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.4rem", color: "var(--foreground)" }}>Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.4rem", color: "var(--foreground)" }}>Ma Faculté</label>
            <select
              value={faculteId}
              onChange={e => setFaculteId(e.target.value)}
              style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box", background: "#fff" }}
            >
              <option value="" disabled>Sélectionner une faculté</option>
              {facultes.map(f => (
                <option key={f.id} value={f.id}>{f.nom}</option>
              ))}
            </select>
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Changer de faculté mettra à jour votre tableau de bord principal.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              type="submit"
              style={{ padding: "0.65rem 1.5rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
            >
              Sauvegarder
            </button>
            {saved && <span style={{ color: "#16a34a", fontSize: "0.85rem", fontWeight: 600 }}>✓ Modifications enregistrées</span>}
          </div>
        </form>
      </div>

      {/* Abonnement */}
      <div style={SECTION_STYLE}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1.25rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          💳 Abonnement
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "var(--foreground)", borderRadius: "10px" }}>
          <div>
            <p style={{ color: "oklch(0.77 0.17 73)", fontWeight: 800, fontSize: "0.85rem", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Plan actuel
            </p>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>
              {user?.plan === "etudiant" ? "Plan Étudiant" : user?.plan === "premium" ? "Plan Premium" : "Plan Gratuit"}
            </p>
          </div>
          <a
            href="/tarifs"
            style={{ padding: "0.6rem 1.25rem", background: "oklch(0.77 0.17 73)", color: "var(--foreground)", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", textDecoration: "none" }}
          >
            Changer de plan →
          </a>
        </div>
      </div>

      {/* Notifications */}
      <div style={SECTION_STYLE}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1.25rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          🔔 Notifications
        </h2>
        {[
          { label: "Rappels de révision quotidiens", desc: "Reçois un e-mail de rappel chaque matin" },
          { label: "Nouveaux résumés générés", desc: "Notification quand un résumé IA est prêt" },
          { label: "Mises à jour de la plateforme", desc: "Sois informé des nouvelles fonctionnalités" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{item.label}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>{item.desc}</p>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: 44, height: 24, cursor: "pointer", flexShrink: 0 }}>
              <input type="checkbox" defaultChecked={i === 0} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: "absolute", inset: 0, background: i === 0 ? "var(--primary)" : "var(--border)",
                borderRadius: 999, transition: "background 0.2s"
              }} />
            </label>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div style={{ ...SECTION_STYLE, border: "1px solid #fecaca" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem", color: "oklch(0.577 0.245 27.325)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          ⚠️ Zone dangereuse
        </h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => { if (confirm("Supprimer toutes vos données ?")) alert("Données supprimées (simulation)."); }}
            style={{ padding: "0.6rem 1.25rem", background: "#fff", color: "oklch(0.577 0.245 27.325)", border: "1px solid #fecaca", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
          >
            Supprimer toutes mes données
          </button>
          <button
            onClick={() => { if (confirm("Supprimer votre compte ?")) logout(); }}
            style={{ padding: "0.6rem 1.25rem", background: "oklch(0.577 0.245 27.325)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
          >
            Supprimer mon compte
          </button>
        </div>
      </div>
    </>
  );
}
