import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserCheck, UserX } from "lucide-react";

const AdminMembers = () => {
  const { users } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Member Management</h1>
      <p className="text-muted-foreground">{users.length} members registered.</p>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">NAME</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">EMAIL</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DEPT</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">YEAR</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">REG NO.</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">PROBLEMS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">EVENTS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{u.name.charAt(0)}</div>
                    <span className="text-sm font-medium text-foreground">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{u.email}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{u.department}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{u.year}</td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{u.registerNumber}</td>
                <td className="px-4 py-3 font-mono text-sm text-foreground">{u.problemsSolved}</td>
                <td className="px-4 py-3 font-mono text-sm text-foreground">{u.eventsAttended}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="p-1.5 rounded hover:bg-primary/10 text-primary" title="Approve"><UserCheck size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Remove"><UserX size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembers;
