"use client";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Att = { _id: string; userId: string; date: string; status: string; notes?: string };

export default function AttendancePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Att[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const path = user && (user.role === 'admin' || user.role === 'superadmin') ? '/attendance' : '/attendance/me';
      setItems(await api.get<Att[]>(path));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [user]);

  const markToday = async (status: 'present'|'absent'|'leave') => {
    await api.post('/attendance', { status });
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <div className="flex gap-2">
          <button onClick={() => markToday('present')} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Mark Present</button>
          <button onClick={() => markToday('absent')} className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900">Absent</button>
          <button onClick={() => markToday('leave')} className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900">Leave</button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-left text-xs font-medium uppercase tracking-wider text-white">
            <tr>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Status</th>
              {(user && (user.role === 'admin' || user.role === 'superadmin')) && <th className="px-3 py-3">User</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={3} className="px-3 py-6 text-center text-gray-500">No records</td></tr>
            ) : items.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="px-3 py-2">{new Date(a.date).toLocaleDateString()}</td>
                <td className="px-3 py-2">{a.status}</td>
                {(user && (user.role === 'admin' || user.role === 'superadmin')) && <td className="px-3 py-2">{a.userId}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


