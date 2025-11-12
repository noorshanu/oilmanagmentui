"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'employee' | 'admin' | 'superadmin'>("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name, password, role }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Signup failed');
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
          <div className="text-2xl font-semibold text-black">Create your account</div>
          <p className="mt-1 text-sm text-gray-600">Sign up to get started</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600">
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <p className="text-xs text-gray-500">Note: The first account may become Super Admin; later signups requesting Super Admin will be downgraded per server rules.</p>
          </div>
          <button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/auth/login" className="font-medium text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}


