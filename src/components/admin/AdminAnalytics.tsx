import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { BarChart3, Users, Calendar, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminAnalytics = () => {
  const { users } = useAuth();
  const { events } = useData();

  const monthlyData = [
    { month: "Oct", users: 12 }, { month: "Nov", users: 18 }, { month: "Dec", users: 22 },
    { month: "Jan", users: 28 }, { month: "Feb", users: 35 }, { month: "Mar", users: users.length },
  ];

  const deptData = users.reduce((acc, u) => {
    const existing = acc.find(d => d.name === u.department);
    if (existing) existing.value++;
    else acc.push({ name: u.department, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ["hsl(150, 60%, 40%)", "hsl(25, 95%, 55%)", "hsl(210, 60%, 50%)", "hsl(280, 60%, 50%)", "hsl(45, 80%, 50%)"];

  const eventStats = {
    total: events.length,
    upcoming: events.filter(e => e.status === "upcoming").length,
    live: events.filter(e => e.status === "live").length,
    completed: events.filter(e => e.status === "completed").length,
    totalRegistrations: events.reduce((s, e) => s + e.registrations.length, 0),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><BarChart3 size={24} className="text-primary" /> Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card"><Users size={20} className="text-primary" /><p className="text-2xl font-bold font-mono text-foreground">{users.length}</p><p className="text-sm text-muted-foreground">Total Members</p></div>
        <div className="stat-card"><Calendar size={20} className="text-streak-orange" /><p className="text-2xl font-bold font-mono text-foreground">{eventStats.total}</p><p className="text-sm text-muted-foreground">Total Events</p></div>
        <div className="stat-card"><Activity size={20} className="text-accent-foreground" /><p className="text-2xl font-bold font-mono text-foreground">{eventStats.totalRegistrations}</p><p className="text-sm text-muted-foreground">Event Registrations</p></div>
        <div className="stat-card"><BarChart3 size={20} className="text-primary" /><p className="text-2xl font-bold font-mono text-foreground">{Math.round(users.reduce((s, u) => s + u.problemsSolved, 0) / users.length)}</p><p className="text-sm text-muted-foreground">Avg Problems/Member</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Active Users Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 16%)" />
              <XAxis dataKey="month" stroke="hsl(150, 5%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(150, 5%, 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(150, 15%, 11%)", border: "1px solid hsl(150, 15%, 16%)", borderRadius: "8px", color: "hsl(150, 10%, 90%)" }} />
              <Area type="monotone" dataKey="users" stroke="hsl(150, 60%, 40%)" fill="hsl(150, 60%, 40%)" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Members by Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(150, 15%, 11%)", border: "1px solid hsl(150, 15%, 16%)", borderRadius: "8px", color: "hsl(150, 10%, 90%)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Event Participation Statistics</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl font-bold font-mono text-primary">{eventStats.upcoming}</p><p className="text-sm text-muted-foreground">Upcoming</p></div>
          <div><p className="text-2xl font-bold font-mono text-streak-red">{eventStats.live}</p><p className="text-sm text-muted-foreground">Live</p></div>
          <div><p className="text-2xl font-bold font-mono text-muted-foreground">{eventStats.completed}</p><p className="text-sm text-muted-foreground">Completed</p></div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
