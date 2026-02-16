"use client";

import { useEffect, useState } from "react";
import api, { getCached, setCache } from "@/lib/api";
import { StatsCard } from "@/components/StatsCard";
import { Users, FileText, CreditCard, Repeat, LogOut } from "lucide-react";
import { Customer, Invoice, Payment, Subscription, ActivityItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

function PackageStatusList({ packages }: { packages: { id: number; name: string; speed?: string }[] }) {
  const [status, setStatus] = useState<Record<number, { ping: number; traffic: number }>>({});
  useEffect(() => {
    const initial: Record<number, { ping: number; traffic: number }> = {};
    packages.forEach((p) => {
      initial[p.id] = { ping: Math.floor(Math.random() * 80) + 10, traffic: Math.floor(Math.random() * 90) + 5 };
    });
    setStatus(initial);
  }, [packages]);
  useEffect(() => {
    const t = setInterval(() => {
      setStatus((prev) => {
        const next: Record<number, { ping: number; traffic: number }> = {};
        packages.forEach((p) => {
          const prevItem = prev[p.id] || { ping: 50, traffic: 50 };
          const pingDelta = Math.floor(Math.random() * 11) - 5;
          const trafficDelta = Math.floor(Math.random() * 15) - 7;
          const ping = Math.max(5, Math.min(150, prevItem.ping + pingDelta));
          const traffic = Math.max(0, Math.min(100, prevItem.traffic + trafficDelta));
          next[p.id] = { ping, traffic };
        });
        return next;
      });
    }, 1200);
    return () => clearInterval(t);
  }, [packages]);
  return (
    <div className="space-y-4">
      {packages.map((p) => {
        const current = status[p.id] || { ping: 0, traffic: 0 };
        const color =
          current.ping < 40 ? "bg-emerald-500" : current.ping < 80 ? "bg-amber-500" : "bg-rose-500";
        return (
          <div key={p.id} className="rounded-md border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-800">{p.name}</div>
              <div className="text-xs text-slate-500">{p.speed || ""}</div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${color} animate-pulse`} />
                <span className="text-xs text-slate-600">{current.ping} ms</span>
              </div>
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-violet-600 transition-all"
                    style={{ width: `${current.traffic}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-[11px] text-slate-500">{current.traffic}%</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({
    customers: 0,
    activeSubscriptions: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [subscriptionsData, setSubscriptionsData] = useState<Subscription[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [expandActivity, setExpandActivity] = useState(false);
  const [expandStatus, setExpandStatus] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const [customers, subscriptions, invoices, payments, activity] = await Promise.all([
          getCached<Customer[]>("/customers"),
          getCached<Subscription[]>("/subscriptions"),
          getCached<Invoice[]>("/invoices"),
          getCached<Payment[]>("/payments"),
          getCached<ActivityItem[]>("/activity"),
        ]);
        setSubscriptionsData(subscriptions);
        setActivities(activity);

        // Calculate stats
        const pendingInvoices = invoices.filter((inv) => inv.status !== "paid").length;
        // Assuming 'amount' is a string or number, handle conversion
        const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

        setStats({
          customers: customers.length,
          activeSubscriptions: subscriptions.length, // Assuming all are active for now
          pendingInvoices,
          totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h2>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value={stats.customers}
          icon={Users}
        />
        <StatsCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={Repeat}
        />
        <StatsCard
          title="Pending Invoices"
          value={stats.pendingInvoices}
          icon={FileText}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={CreditCard}
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-800">Recent Activity</h3>
            {activities.length > 0 && (
              <button
                className="text-xs font-semibold text-violet-600 hover:text-violet-500"
                onClick={async () => {
                  if (!expandActivity) {
                    const more = await getCached<ActivityItem[]>("/activity?limit=50");
                    setActivities(more);
                  }
                  setExpandActivity((v) => !v);
                }}
              >
                {expandActivity ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          {activities.length === 0 ? (
            <p className="text-slate-500">No recent activity to show.</p>
          ) : (
            <ul className="space-y-3">
              {(expandActivity ? activities : activities.slice(0, 4)).map((item, idx) => (
                <li key={idx} className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.type} • {item.action}</div>
                  </div>
                  <div className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString('id-ID')}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-800">System Status</h3>
            <button
              className="text-xs font-semibold text-violet-600 hover:text-violet-500"
              onClick={() => setExpandStatus((v) => !v)}
            >
              {expandStatus ? "Show less" : "Show more"}
            </button>
          </div>
          <PackageStatusList
            packages={(expandStatus ? Array.from(
              new Map(
                subscriptionsData
                  .filter((s) => s.package)
                  .map((s) => [s.package!.id, { id: s.package!.id, name: s.package!.name, speed: s.package!.speed }])
              ).values()
            ) : Array.from(
              new Map(
                subscriptionsData
                  .filter((s) => s.package)
                  .map((s) => [s.package!.id, { id: s.package!.id, name: s.package!.name, speed: s.package!.speed }])
              ).values()
            ).slice(0, 3))}
          />
        </div>
      </div>
    </div>
  );
}
