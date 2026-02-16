"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  FileText,
  Repeat
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCached } from "@/lib/api";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Packages", href: "/packages", icon: Package },
  { name: "Subscriptions", href: "/subscriptions", icon: Repeat },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 items-center justify-center border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800">StorSync Billing</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
              onMouseEnter={() => {
                if (item.href === "/customers") getCached("/customers");
                if (item.href === "/packages") getCached("/packages");
                if (item.href === "/subscriptions") getCached("/subscriptions");
                if (item.href === "/invoices") getCached("/invoices");
                if (item.href === "/payments") getCached("/payments");
              }}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-500"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
