import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Coins } from "lucide-react";

const AdminMembers = () => {
  const { profiles } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Member Management</h1>
      <p className="text-muted-foreground">{profiles.length} members registered.</p>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">NAME</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">EMAIL</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DEPT</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">YEAR</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">REG NO.</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">POINTS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">JOINED</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.user_id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{p.name.charAt(0)}</div>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{p.email}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.department || "-"}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.year || "-"}</td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{p.register_number || "-"}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 font-mono text-sm text-primary"><Coins size={12} /> {p.points}</span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembers;
