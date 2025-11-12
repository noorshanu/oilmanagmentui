"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      localStorage.setItem('token', data.token);
      router.replace('/');
      setTimeout(() => window.location.reload(), 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-xl">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold text-black">🛢️ Oilfield Management</div>
          <p className="mt-1 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="you@company.com" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Password</label>
              <button type="button" onClick={() => setShow((s) => !s)} className="text-xs text-blue-600 hover:underline">{show ? 'Hide' : 'Show'}</button>
            </div>
            <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="••••••••" />
          </div>
          <button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account? <a href="/auth/signup" className="font-medium text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}


