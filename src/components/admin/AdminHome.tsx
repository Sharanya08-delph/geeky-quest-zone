import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";

const AdminHome = () => {
  const { users } = useAuth();
  const { events, announcements } = useData();

  const stats = [
    { label: "Total Members", value: users.length, icon: Users, color: "text-primary" },
    { label: "Active Events", value: events.filter(e => e.status !== "completed").length, icon: Calendar, color: "text-streak-orange" },
    { label: "Announcements", value: announcements.length, icon: Activity, color: "text-accent-foreground" },
    { label: "Avg Problems", value: Math.round(users.reduce((s, u) => s + u.problemsSolved, 0) / users.length), icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="text-muted-foreground">{users.length} members registered. System stable.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <s.icon size={20} className={s.color} />
            <p className="text-3xl font-bold font-mono text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Events</h2>
          {events.slice(0, 3).map(e => (
            <div key={e.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm text-foreground">{e.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${e.status === "live" ? "bg-streak-red/15 text-streak-red" : e.status === "upcoming" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{e.status}</span>
            </div>
          ))}
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Performers</h2>
          {[...users].sort((a, b) => b.problemsSolved - a.problemsSolved).slice(0, 3).map((u, i) => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground text-sm">#{i + 1}</span>
                <span className="text-sm text-foreground">{u.name}</span>
              </div>
              <span className="font-mono text-sm text-primary">{u.problemsSolved} solved</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
