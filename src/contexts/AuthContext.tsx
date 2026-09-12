"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export type Plan = "decouverte" | "etudiant" | "premium";

export interface StoredUser {
  id: string;
  nom: string;
  email: string;
  passwordHash: string;
  plan: Plan;
  status: "trial" | "active" | "expired";
  billingCycle?: "monthly" | "annual";
  trialEndsAt: string;
  audioUsedMinutes: number;
  hasCompletedOnboarding: boolean;
  faculteId?: string;
  prenom?: string;
  age?: string;
  ville?: string;
  avatarId?: string;
}

export interface AuthUser {
  id: string;
  nom: string;
  email: string;
  plan: Plan;
  status: "trial" | "active" | "expired";
  trialEndsAt: string;
  audioUsedMinutes: number;
  hasCompletedOnboarding: boolean;
  faculteId?: string;
  prenom?: string;
  age?: string;
  ville?: string;
  avatarId?: string;
  billingCycle?: "monthly" | "annual";
}

// Audio limits per plan (in minutes)
export const PLAN_AUDIO_LIMITS: Record<Plan, number> = {
  decouverte: 30,
  etudiant: 120,
  premium: Infinity,
};

export const PLAN_LABELS: Record<Plan, string> = {
  decouverte: "Découverte",
  etudiant: "Étudiant",
  premium: "Premium",
};

type AuthCtx = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  register: (nom: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  setPlan: (plan: Plan) => void;
  addAudioMinutes: (minutes: number) => void;
  completeOnboarding: (data: { faculteId: string; prenom: string; age: string; ville: string; avatarId: string }) => void;
  updateUser: (data: Partial<StoredUser>) => void;
  audioLimitMinutes: number;
  audioRemainingMinutes: number;
};

// ── Mock DB ────────────────────────────────────────────────────────────────

const MOCK_DB_KEY = "studia_users";
const MOCK_SESSION_KEY = "studia_session";

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MOCK_DB_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
}

function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(MOCK_SESSION_KEY);
}

function saveSession(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem(MOCK_SESSION_KEY, id);
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
}

const uid = () => Math.random().toString(36).substring(2, 9);

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Init session on mount
  useEffect(() => {
    const sessionId = getSession();
    if (sessionId) {
      const users = getUsers();
      const found = users.find((u) => u.id === sessionId);
      if (found) {
        setUser({
          id: found.id,
          nom: found.nom,
          email: found.email,
          plan: found.plan,
          status: found.status || "trial",
          trialEndsAt: found.trialEndsAt || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          audioUsedMinutes: found.audioUsedMinutes,
          hasCompletedOnboarding: found.hasCompletedOnboarding ?? false,
          faculteId: found.faculteId,
          prenom: found.prenom,
          age: found.age,
          ville: found.ville,
          avatarId: found.avatarId,
          billingCycle: found.billingCycle,
        });
      }
    }
  }, []);

  const register = useCallback(
    (nom: string, email: string, password: string) => {
      const users = getUsers();
      if (users.find((u) => u.email === email)) {
        return { ok: false, error: "Cet e-mail est déjà utilisé." };
      }
      const newUser: StoredUser = {
        id: `usr_${uid()}`,
        nom,
        email,
        passwordHash: password, // fake hash
        plan: "etudiant",
        status: "trial",
        trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        audioUsedMinutes: 0,
        hasCompletedOnboarding: false,
      };
      users.push(newUser);
      saveUsers(users);
      saveSession(newUser.id);
      setUser({
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
        plan: newUser.plan,
        status: newUser.status,
        trialEndsAt: newUser.trialEndsAt,
        audioUsedMinutes: newUser.audioUsedMinutes,
        hasCompletedOnboarding: false,
      });
      return { ok: true };
    },
    []
  );

  const login = useCallback(
    (email: string, password: string) => {
      const users = getUsers();
      const found = users.find((u) => u.email === email && u.passwordHash === password);
      if (!found) {
        return { ok: false, error: "Identifiants incorrects." };
      }
      saveSession(found.id);
      setUser({
        id: found.id,
        nom: found.nom,
        email: found.email,
        plan: found.plan,
        audioUsedMinutes: found.audioUsedMinutes,
        hasCompletedOnboarding: found.hasCompletedOnboarding ?? false,
        faculteId: found.faculteId,
        prenom: found.prenom,
        age: found.age,
        ville: found.ville,
        avatarId: found.avatarId,
        billingCycle: found.billingCycle,
      });
      return { ok: true };
    },
    []
  );

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
  }, []);

  const setPlan = useCallback((plan: Plan) => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    users[idx].plan = plan;
    saveUsers(users);
    setUser((prev) => (prev ? { ...prev, plan } : null));
  }, [user]);

  const addAudioMinutes = useCallback((minutes: number) => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    const newTotal = (users[idx].audioUsedMinutes || 0) + minutes;
    users[idx].audioUsedMinutes = newTotal;
    saveUsers(users);
    setUser((prev) => (prev ? { ...prev, audioUsedMinutes: newTotal } : null));
  }, [user]);

  const updateUser = useCallback((data: Partial<StoredUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      
      const storedStr = localStorage.getItem("studia_users");
      if (storedStr) {
        const users: StoredUser[] = JSON.parse(storedStr);
        const index = users.findIndex(u => u.id === updated.id);
        if (index !== -1) {
          users[index] = { ...users[index], ...data };
          localStorage.setItem("studia_users", JSON.stringify(users));
        }
      }
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback((data: { faculteId: string; prenom: string; age: string; ville: string; avatarId: string }) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { 
        ...prev, 
        hasCompletedOnboarding: true, 
        ...data
      };
      
      const storedStr = localStorage.getItem("studia_users");
      if (storedStr) {
        const users: StoredUser[] = JSON.parse(storedStr);
        const index = users.findIndex(u => u.id === updated.id);
        if (index !== -1) {
          users[index].hasCompletedOnboarding = true;
          if (data.faculteId) users[index].faculteId = data.faculteId;
          if (data.prenom) users[index].prenom = data.prenom;
          if (data.age) users[index].age = data.age;
          if (data.ville) users[index].ville = data.ville;
          if (data.avatarId) users[index].avatarId = data.avatarId;
          localStorage.setItem("studia_users", JSON.stringify(users));
        }
      }
      return updated;
    });
  }, []);

  const audioLimitMinutes = user ? PLAN_AUDIO_LIMITS[user.plan] : PLAN_AUDIO_LIMITS.decouverte;
  const audioRemainingMinutes = user
    ? Math.max(0, audioLimitMinutes - user.audioUsedMinutes)
    : 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        register,
        login,
        logout,
        setPlan,
        addAudioMinutes,
        completeOnboarding,
        updateUser,
        audioLimitMinutes,
        audioRemainingMinutes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
