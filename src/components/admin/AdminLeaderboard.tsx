import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Coins } from "lucide-react";

const AdminLeaderboard = () => {
  const { profiles } = useAuth();
  const sorted = [...profiles].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Trophy size={24} className="text-primary" /> Leaderboard Control</h1>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">RANK</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">MEMBER</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DEPT</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">POINTS</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No members yet.</td></tr>
            ) : (
              sorted.map((p, i) => (
                <tr key={p.user_id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-muted-foreground">#{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{p.name.charAt(0)}</div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{p.name}</span>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.department || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary"><Coins size={12} /> {p.points}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaderboard;
