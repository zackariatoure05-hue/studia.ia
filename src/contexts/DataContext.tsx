"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  MOCK_COURS,
  MOCK_FACULTES,
  MOCK_MATIERES,
  MOCK_RESUMES,
  MOCK_FLASHCARDS,
  type Cours,
  type Faculte,
  type Matiere,
  type Resume,
  type Flashcard,
} from "@/lib/fake-data";

// ── Types ──────────────────────────────────────────────────────────────────

type DataCtx = {
  facultes: Faculte[];
  matieres: Matiere[];
  cours: Cours[];
  resumes: Resume[];
  flashcards: Flashcard[];

  // Facultés
  addFaculte: (nom: string, couleur: string) => Faculte;
  renameFaculte: (id: string, nom: string) => void;
  deleteFaculte: (id: string) => void;

  // Matières
  addMatiere: (faculte_id: string, nom: string, couleur: string) => Matiere;
  renameMatiere: (id: string, nom: string) => void;
  deleteMatiere: (id: string) => void;

  // Cours
  addCours: (matiere_id: string, titre: string, type: "texte_colle" | "audio") => Cours;
  addCoursTexte: (
    matiere_id: string,
    titre: string,
    contenu: string,
    aiGenerated?: {
      resume: string;
      pointsCles: string[];
      flashcards: { question: string; reponse: string }[];
    }
  ) => Cours;
  addCoursAudio: (
    matiere_id: string,
    titre: string,
    transcription: string,
    durationSec?: number,
    aiGenerated?: {
      resume: string;
      pointsCles: string[];
      flashcards: { question: string; reponse: string }[];
    }
  ) => Cours;
  deleteCours: (id: string) => void;

  // Flashcards
  updateFlashcardStatus: (id: string, statut: "nouvelle" | "en_cours" | "maitrisee") => void;

  // States
  isLoading: boolean;
  isError: boolean;
  triggerError: (val: boolean) => void;
};

// ── Context ────────────────────────────────────────────────────────────────

const DataContext = createContext<DataCtx | null>(null);

let _counter = 1000; // simple incrementing ID for new items
function uid(prefix: string) {
  return `${prefix}_${++_counter}`;
}

// ── Provider ───────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
  const [facultes, setFacultes] = useState<Faculte[]>(MOCK_FACULTES);
  const [matieres, setMatieres] = useState<Matiere[]>(MOCK_MATIERES);
  const [cours, setCours] = useState<Cours[]>(MOCK_COURS);
  const [resumes, setResumes] = useState<Resume[]>(MOCK_RESUMES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(MOCK_FLASHCARDS);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Simulation du chargement initial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const triggerError = useCallback((val: boolean) => {
    setIsError(val);
  }, []);

  // ── Facultés ──
  const addFaculte = useCallback((nom: string, couleur: string): Faculte => {
    const f: Faculte = {
      id: uid("fac"),
      user_id: "usr_1",
      nom,
      couleur,
      cree_le: new Date().toISOString(),
    };
    setFacultes((prev) => [...prev, f]);
    return f;
  }, []);

  const renameFaculte = useCallback((id: string, nom: string) => {
    setFacultes((prev) => prev.map((f) => (f.id === id ? { ...f, nom } : f)));
  }, []);

  const deleteFaculte = useCallback((id: string) => {
    setFacultes((prev) => prev.filter((f) => f.id !== id));
    // cascade
    setMatieres((prev) => {
      const idsToRemove = prev.filter((m) => m.faculte_id === id).map((m) => m.id);
      setCours((prevC) => {
        const coursToRemove = prevC
          .filter((c) => idsToRemove.includes(c.matiere_id))
          .map((c) => c.id);
        setResumes((prevR) => prevR.filter((r) => !coursToRemove.includes(r.cours_id)));
        setFlashcards((prevF) => prevF.filter((f) => !coursToRemove.includes(f.cours_id)));
        return prevC.filter((c) => !idsToRemove.includes(c.matiere_id));
      });
      return prev.filter((m) => m.faculte_id !== id);
    });
  }, []);

  // ── Matières ──
  const addMatiere = useCallback((faculte_id: string, nom: string, couleur: string): Matiere => {
    const m: Matiere = {
      id: uid("mat"),
      faculte_id,
      nom,
      couleur,
      cree_le: new Date().toISOString(),
    };
    setMatieres((prev) => [...prev, m]);
    return m;
  }, []);

  const renameMatiere = useCallback((id: string, nom: string) => {
    setMatieres((prev) => prev.map((m) => (m.id === id ? { ...m, nom } : m)));
  }, []);

  const deleteMatiere = useCallback((id: string) => {
    setMatieres((prev) => prev.filter((m) => m.id !== id));
    setCours((prev) => {
      const coursToRemove = prev.filter((c) => c.matiere_id === id).map((c) => c.id);
      setResumes((prevR) => prevR.filter((r) => !coursToRemove.includes(r.cours_id)));
      setFlashcards((prevF) => prevF.filter((f) => !coursToRemove.includes(f.cours_id)));
      return prev.filter((c) => c.matiere_id !== id);
    });
  }, []);

  // ── Cours ──
  const addCours = useCallback(
    (matiere_id: string, titre: string, type: "texte_colle" | "audio"): Cours => {
      const c: Cours = {
        id: uid("crs"),
        matiere_id,
        titre,
        type,
        contenu_brut: "",
        cree_le: new Date().toISOString(),
      };
      setCours((prev) => [...prev, c]);
      return c;
    },
    []
  );

  const deleteCours = useCallback((id: string) => {
    setCours((prev) => prev.filter((c) => c.id !== id));
    setResumes((prev) => prev.filter((r) => r.cours_id !== id));
    setFlashcards((prev) => prev.filter((f) => f.cours_id !== id));
  }, []);

  const updateFlashcardStatus = useCallback(
    (id: string, statut: "nouvelle" | "en_cours" | "maitrisee") => {
      setFlashcards((prev) => prev.map((f) => (f.id === id ? { ...f, statut } : f)));
    },
    []
  );

  const addCoursTexte = useCallback(
    (
      matiere_id: string,
      titre: string,
      contenu: string,
      aiGenerated?: {
        resume: string;
        pointsCles: string[];
        flashcards: { question: string; reponse: string }[];
      }
    ): Cours => {
      const c: Cours = {
        id: uid("crs"),
        matiere_id,
        titre,
        type: "texte_colle",
        contenu_brut: contenu,
        cree_le: new Date().toISOString(),
      };
      setCours((prev) => [...prev, c]);

      const sentences = contenu.split(/[.?!]/).filter((s) => s.trim().length > 10);
      const resume: Resume = {
        id: uid("res"),
        cours_id: c.id,
        contenu: aiGenerated?.resume ?? sentences.slice(0, 3).join(". ") + ".",
        points_cles: aiGenerated?.pointsCles ?? sentences.slice(0, 5).map((s) => s.trim()),
        cree_le: new Date().toISOString(),
      };
      setResumes((prev) => [...prev, resume]);

      const newFlashcards: Flashcard[] = (
        aiGenerated?.flashcards ??
        sentences
          .slice(0, 5)
          .map((s, i) => ({ question: `Question ${i + 1} sur ce cours ?`, reponse: s.trim() }))
      ).map((fc) => ({
        id: uid("fc"),
        cours_id: c.id,
        question: fc.question,
        reponse: fc.reponse,
        statut: "nouvelle" as const,
        cree_le: new Date().toISOString(),
      }));
      setFlashcards((prev) => [...prev, ...newFlashcards]);

      return c;
    },
    []
  );

  const addCoursAudio = useCallback(
    (
      matiere_id: string,
      titre: string,
      transcription: string,
      durationSec: number = 0,
      aiGenerated?: {
        resume: string;
        pointsCles: string[];
        flashcards: { question: string; reponse: string }[];
      }
    ): Cours => {
      const c: Cours = {
        id: uid("crs"),
        matiere_id,
        titre,
        type: "audio",
        contenu_brut: transcription,
        duree_audio_secondes: durationSec,
        cree_le: new Date().toISOString(),
      };
      setCours((prev) => [...prev, c]);

      const sentences = transcription.split(/[.?!]/).filter((s) => s.trim().length > 10);
      const resume: Resume = {
        id: uid("res"),
        cours_id: c.id,
        contenu:
          aiGenerated?.resume ?? sentences.slice(0, 3).join(". ") + (sentences.length ? "." : ""),
        points_cles: aiGenerated?.pointsCles ?? sentences.slice(0, 5).map((s) => s.trim()),
        cree_le: new Date().toISOString(),
      };
      setResumes((prev) => [...prev, resume]);

      const newFlashcards: Flashcard[] = (
        aiGenerated?.flashcards ??
        sentences
          .slice(0, 5)
          .map((s, i) => ({ question: `Question audio ${i + 1} ?`, reponse: s.trim() }))
      ).map((fc) => ({
        id: uid("fc"),
        cours_id: c.id,
        question: fc.question,
        reponse: fc.reponse,
        statut: "nouvelle" as const,
        cree_le: new Date().toISOString(),
      }));
      setFlashcards((prev) => [...prev, ...newFlashcards]);

      return c;
    },
    []
  );

  return (
    <DataContext.Provider
      value={{
        facultes,
        matieres,
        cours,
        resumes,
        flashcards,
        addFaculte,
        renameFaculte,
        deleteFaculte,
        addMatiere,
        renameMatiere,
        deleteMatiere,
        addCours,
        addCoursTexte,
        addCoursAudio,
        deleteCours,
        updateFlashcardStatus,
        isLoading,
        isError,
        triggerError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useData(): DataCtx {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
