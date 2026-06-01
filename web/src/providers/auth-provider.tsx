"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, fetchProfile } from "@/lib/api-client";
import {
  clearStoredSession,
  persistSession,
  readStoredSession,
} from "@/lib/auth-storage";
import type { MeResponse, SessionResponse } from "@/types/auth";

interface AuthContextValue {
  session: SessionResponse | null;
  profile: MeResponse | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  isLoadingProfile: boolean;
  login: (login: string, password: string) => Promise<SessionResponse>;
  logout: () => void;
  refreshProfile: () => Promise<MeResponse | null>;
  updateStoredSession: (updater: (session: SessionResponse) => SessionResponse) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedSession = readStoredSession();
    setSession(storedSession);
    setIsHydrated(true);
  }, []);

  const profileQuery = useQuery({
    queryKey: ["authenticated-profile", session?.token],
    queryFn: () => fetchProfile(session!.token),
    enabled: isHydrated && Boolean(session?.token),
    retry: false,
  });

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
    queryClient.removeQueries({ queryKey: ["authenticated-profile"] });
  }, [queryClient]);

  const login = useCallback(async (loginValue: string, password: string) => {
    const createdSession = await createSession(loginValue, password);
    persistSession(createdSession);
    setSession(createdSession);
    return createdSession;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.token) {
      return null;
    }

    const profile = await queryClient.fetchQuery({
      queryKey: ["authenticated-profile", session.token],
      queryFn: () => fetchProfile(session.token),
    });

    return profile;
  }, [queryClient, session?.token]);

  const updateStoredSession = useCallback((
    updater: (currentSession: SessionResponse) => SessionResponse
  ) => {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const nextSession = updater(currentSession);
      persistSession(nextSession);
      return nextSession;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile: profileQuery.data ?? null,
      isHydrated,
      isAuthenticated: Boolean(session?.token),
      isLoadingProfile: profileQuery.isLoading,
      login,
      logout,
      refreshProfile,
      updateStoredSession,
    }),
    [
      isHydrated,
      login,
      logout,
      profileQuery.data,
      profileQuery.isLoading,
      refreshProfile,
      session,
      updateStoredSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
