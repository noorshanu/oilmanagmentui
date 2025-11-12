"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type User = { _id: string; email: string; name: string; role: 'superadmin' | 'admin' | 'employee'; active?: boolean };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { setUsers(await api.get<User[]>("/users")); } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const setRole = async (id: string, role: User['role']) => {
    try { await api.put(`/users/${id}/role`, { role }); await load(); } catch (e: any) { setError(e.message); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete user?')) return;
    try { await api.del(`/users/${id}`); await load(); } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
      </div>
      {error && <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-left text-xs font-medium uppercase tracking-wider text-white">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">No users</td></tr>
            ) : users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">
                  <select className="rounded-md border px-2 py-1" value={u.role} onChange={(e) => setRole(u._id, e.target.value as User['role'])}>
                    <option value="employee">employee</option>
                    <option value="admin">admin</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => del(u._id)} className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


