"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/lib/api";

type User = { id: string; email: string; name: string; role: 'superadmin' | 'admin' | 'employee' } | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('unauth');
      const me = await res.json();
      setUser({ id: me._id || me.id, email: me.email, name: me.name, role: me.role });
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  const value = useMemo(() => ({ user, loading, refresh, logout }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}


