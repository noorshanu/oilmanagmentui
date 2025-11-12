"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FiBox, FiUsers, FiShoppingCart, FiTruck, FiBarChart2, FiHome, FiUserCheck, FiShield } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";

const baseLinks = [
  { href: "/", label: "Dashboard", Icon: FiHome },
  { href: "/inventory", label: "Inventory", Icon: FiBox },
  { href: "/suppliers", label: "Suppliers", Icon: FiTruck },
  { href: "/customers", label: "Customers", Icon: FiUsers },
  { href: "/purchase-orders", label: "Purchase Orders", Icon: FiShoppingCart },
  { href: "/sales-orders", label: "Sales Orders", Icon: FiShoppingCart },
  { href: "/reports", label: "Reports", Icon: FiBarChart2 },
];

export function Nav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const adminLinks = user && (user.role === 'admin' || user.role === 'superadmin') ? [
    { href: "/users", label: "Users", Icon: FiShield },
    { href: "/attendance", label: "Attendance", Icon: FiUserCheck },
  ] : [ { href: "/attendance", label: "Attendance", Icon: FiUserCheck } ];
  const links = [...baseLinks, ...adminLinks];
  return (
    <nav className="h-[calc(100vh-56px)] w-64 shrink-0 border-r bg-white">
      <div className="px-5 py-4 font-semibold">🛢️ Oilfield Management</div>
      <ul className="px-2 space-y-1">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link href={href} className="relative block">
                {active && (
                  <motion.span layoutId="active" className="absolute inset-0 rounded-md bg-blue-100" />
                )}
                <span className={`relative z-10 flex items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? "text-blue-700" : "text-gray-800 hover:bg-gray-50"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


