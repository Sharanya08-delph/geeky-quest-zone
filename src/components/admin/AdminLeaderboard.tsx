import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy } from "lucide-react";

const AdminLeaderboard = () => {
  const { users } = useAuth();
  const sorted = [...users].sort((a, b) => b.problemsSolved - a.problemsSolved);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Trophy size={24} className="text-primary" /> Leaderboard Control</h1>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">RANK</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">MEMBER</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">PROBLEMS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STREAK</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">EVENTS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">BADGES</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((u, i) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-muted-foreground">#{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{u.name.charAt(0)}</div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{u.name}</span>
                      <p className="text-xs text-muted-foreground">{u.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-foreground">{u.problemsSolved}</td>
                <td className="px-4 py-3 font-mono text-sm text-streak-orange">{u.streak}🔥</td>
                <td className="px-4 py-3 font-mono text-sm text-foreground">{u.eventsAttended}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.badges.map(b => (
                      <span key={b} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{b}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaderboard;
