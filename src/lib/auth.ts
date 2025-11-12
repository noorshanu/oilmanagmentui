"use client";

export type Role = "admin" | "manager" | "employee" | "viewer";

const KEY = "demo_role";

export function setRole(role: Role) {
  localStorage.setItem(KEY, role);
}

export function getRole(): Role | null {
  return (localStorage.getItem(KEY) as Role) || null;
}

export function logout() {
  localStorage.removeItem(KEY);
}


