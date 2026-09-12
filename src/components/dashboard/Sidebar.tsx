"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Target,
  Settings,
  Plus,
  BookOpen,
  LogOut,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "/tableau-de-bord" },
  { label: "Ma bibliothèque", icon: BookOpen, href: "/tableau-de-bord/bibliotheque" },
  { label: "Révision", icon: Target, href: "/tableau-de-bord/revision" },
  { label: "Paramètres", icon: Settings, href: "/tableau-de-bord/parametres" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { facultes, matieres } = useData();
  const { user, logout } = useAuth();

  const faculteId = user?.faculteId;
  const userFaculte = facultes.find((f) => f.id === faculteId);
  const userMatieres = matieres.filter((m) => m.faculte_id === faculteId);

  const displayName = user?.prenom || user?.nom || "Étudiant";
  const displayPlan = user?.plan
    ? ({ decouverte: "Plan Découverte", etudiant: "Plan Étudiant", premium: "Plan Premium" }[
        user.plan
      ] ?? "Plan Découverte")
    : "Plan Découverte";

  // On utilise l'initiale plutôt qu'une image potentiellement manquante
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="hidden md:flex flex-col w-[260px] shrink-0 bg-white border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2.5 no-underline text-foreground group">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <GraduationCap size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            Studi<span className="text-primary">IA</span>
          </span>
        </Link>
      </div>

      {/* Bouton Nouveau cours */}
      <div className="p-4">
        <button
          onClick={() => router.push("/tableau-de-bord/nouveau-cours")}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-xl font-semibold text-sm shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          Nouveau cours
        </button>
      </div>

      {/* Navigation Principale */}
      <nav className="px-3 pb-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="no-underline">
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} className={active ? "text-primary" : "text-muted-foreground"} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Ma Faculté & Mes Matières */}
      {userFaculte && (
        <div className="px-6 pt-4 pb-2 mt-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            {userFaculte.nom}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {!userFaculte ? (
          <div className="p-3 text-center mt-4 border border-dashed rounded-xl border-border bg-muted/30">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Tu n&apos;as pas encore choisi de faculté.
            </p>
            <button
              onClick={() => router.push("/tableau-de-bord/parametres")}
              className="mt-2 text-primary font-semibold text-xs hover:underline"
            >
              Paramètres →
            </button>
          </div>
        ) : userMatieres.length === 0 ? (
          <div className="p-3 text-center mt-4">
            <p className="text-muted-foreground text-xs">Aucune matière pour le moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {userMatieres.map((mat) => {
              const matHref = `/tableau-de-bord/matiere/${mat.id}`;
              const matActive = pathname.startsWith(matHref);
              return (
                <Link key={mat.id} href={matHref} className="no-underline">
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors overflow-hidden ${
                      matActive
                        ? "bg-primary/5 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                    }`}
                  >
                    <BookOpen
                      size={16}
                      className={matActive ? "text-primary" : "text-muted-foreground/70"}
                    />
                    <span className="truncate">{mat.nom}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Profil Utilisateur */}
      <div className="p-4 border-t border-border/50 bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20 shrink-0">
            <span className="text-lg">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{displayName}</p>
            <p className="text-xs text-primary font-medium truncate">{displayPlan}</p>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            title="Se déconnecter"
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
