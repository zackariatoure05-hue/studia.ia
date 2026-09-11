"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth, PLAN_LABELS } from "@/contexts/AuthContext";
import { useRecording } from "@/contexts/RecordingContext";

export default function Topbar() {
  const router = useRouter();
  const { triggerError } = useData();
  const { user, logout } = useAuth();
  const { isRecording, isPaused, recordingTime, stopRecording, pauseRecording, resumeRecording } = useRecording();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const displayName = user?.nom || "Étudiant";
  const displayInitial = displayName[0]?.toUpperCase() ?? "E";
  const displayPlan = user?.plan ? PLAN_LABELS[user.plan] : "Plan Gratuit";

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  function handleDeconnexion() {
    setMenuOpen(false);
    logout();
    router.push("/");
  }

  return (
    <header style={{
      height: 58,
      background: "#fff",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.75rem",
      position: "sticky", top: 0, zIndex: 40,
      backdropFilter: "blur(8px)",
    }}>
      {/* Gauche — breadcrumb slot */}
      <div id="topbar-breadcrumb" />

      {/* Droite — actions + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginLeft: "auto" }}>

        {/* Indicateur d'enregistrement global */}
        {isRecording && (
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: isPaused ? "oklch(0.96 0 0)" : "oklch(0.97 0.04 73)",
            border: `1px solid ${isPaused ? "oklch(0.85 0 0)" : "oklch(0.85 0.12 73)"}`,
            borderRadius: "999px",
            padding: "0.35rem 0.75rem",
            animation: "fadeIn 0.3s",
            transition: "all 0.25s",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isPaused ? "oklch(0.5 0 0)" : "oklch(0.6 0.25 27)",
              display: "inline-block",
              animation: isPaused ? "none" : "pulse 1.5s infinite",
            }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: isPaused ? "oklch(0.4 0 0)" : "oklch(0.5 0.2 27)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(recordingTime)}
            </span>
            {isPaused ? (
              <button
                onClick={resumeRecording}
                title="Reprendre"
                style={{
                  background: "oklch(0.77 0.17 73)", color: "oklch(0.12 0 0)", border: "none",
                  borderRadius: "999px", padding: "0.15rem 0.6rem",
                  fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
                }}
              >
                ▶ Reprendre
              </button>
            ) : (
              <button
                onClick={pauseRecording}
                title="Pause"
                style={{
                  background: "oklch(0.25 0 0)", color: "#fff", border: "none",
                  borderRadius: "999px", padding: "0.15rem 0.6rem",
                  fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
                }}
              >
                ⏸ Pause
              </button>
            )}
            <button
              onClick={stopRecording}
              title="Arrêter"
              style={{
                background: "oklch(0.6 0.25 27)", color: "#fff", border: "none",
                borderRadius: "999px", padding: "0.15rem 0.6rem",
                fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              ■ Stop
            </button>
          </div>
        )}

        {/* Nouveau cours — raccourci rapide */}
        <button
          onClick={() => router.push("/tableau-de-bord/nouveau-cours")}
          className="btn-primary"
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.45rem 1rem",
            background: "var(--primary)", color: "#fff",
            border: "none", borderRadius: "var(--radius)",
            fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau cours
        </button>

        {/* Avatar + menu */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            id="topbar-avatar-btn"
            onClick={() => setMenuOpen((v) => !v)}
            className="topbar-btn"
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              background: menuOpen ? "oklch(0.96 0.02 276)" : "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "0.35rem 0.7rem",
              cursor: "pointer", color: "var(--foreground)",
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--primary)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.8rem",
              boxShadow: "0 1px 4px oklch(0.511 0.262 276.966 / 0.3)",
            }}>
              {displayInitial}
            </div>
            <span style={{ fontWeight: 600, fontSize: "0.85rem", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </span>
            {/* Chevron */}
            <svg
              xmlns="http://www.w3.org/2000/svg" width="13" height="13"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
              style={{ color: "var(--muted-foreground)", transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)", transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: "calc(var(--radius) + 2px)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                minWidth: 210, zIndex: 100,
                overflow: "hidden",
              }}
            >
              {/* Info user */}
              <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)", background: "oklch(0.99 0.01 276)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "var(--primary)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.95rem",
                  }}>
                    {displayInitial}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", margin: 0 }}>{displayName}</p>
                    <p style={{ color: "var(--primary)", fontSize: "0.72rem", margin: 0, fontWeight: 600 }}>{displayPlan}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              {[
                { label: "Mon profil", emoji: "👤", href: "/tableau-de-bord/parametres" },
                { label: "Abonnement", emoji: "⭐", href: "/tarifs" },
                { label: "Paramètres", emoji: "⚙️", href: "/tableau-de-bord/parametres" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="topbar-btn"
                    style={{
                      padding: "0.65rem 1rem",
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      fontSize: "0.875rem", color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{item.emoji}</span> {item.label}
                  </div>
                </Link>
              ))}

              {/* Déconnexion */}
              <div style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={handleDeconnexion}
                  className="topbar-btn"
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: "0.65rem 1rem", textAlign: "left",
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    fontSize: "0.875rem", color: "oklch(0.577 0.245 27.325)",
                    cursor: "pointer", fontWeight: 600,
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"/>
                  </svg>
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
