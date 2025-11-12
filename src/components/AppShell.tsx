"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Nav } from "@/components/Nav";
import { Header } from "@/components/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = pathname?.startsWith('/auth');

  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    if (!loading && !user && !isAuthRoute && !hasToken) {
      router.replace('/auth/login');
    }
    if (!loading && user && isAuthRoute) {
      router.replace('/');
    }
  }, [loading, user, isAuthRoute, router]);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  if (isAuthRoute) {
    // Always render auth routes without app shell (no header/nav)
    return <main className="min-h-screen bg-white text-black">{children}</main>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="flex">
        <Nav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}


