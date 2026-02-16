import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{value}</p>
        </div>
        <div className="rounded-full bg-violet-50 p-3 text-violet-600">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={trendUp ? "text-emerald-600" : "text-rose-600"}>
            {trend}
          </span>
          <span className="ml-2 text-slate-500">from last month</span>
        </div>
      )}
    </div>
  );
}
