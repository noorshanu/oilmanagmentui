"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4">
      <div className="font-semibold">Admin Dashboard</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">{user.name} • {user.role}</span>
        <button onClick={() => { logout(); router.push('/auth/login'); }} className="rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700">Logout</button>
      </div>
    </header>
  );
}


