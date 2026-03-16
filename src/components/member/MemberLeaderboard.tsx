import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Coins } from "lucide-react";

const rankIcons = [
  <Crown size={20} className="text-yellow-400" />,
  <Medal size={20} className="text-gray-300" />,
  <Medal size={20} className="text-amber-600" />,
];

const MemberLeaderboard = () => {
  const { profiles } = useAuth();
  const sorted = [...profiles].sort((a, b) => b.points - a.points);

  const getBadge = (points: number) => {
    if (points >= 500) return { label: "Diamond", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    if (points >= 300) return { label: "Platinum", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
    if (points >= 150) return { label: "Gold", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
    if (points >= 50) return { label: "Silver", color: "bg-gray-400/10 text-gray-300 border-gray-400/20" };
    return { label: "Bronze", color: "bg-amber-700/10 text-amber-600 border-amber-700/20" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy size={24} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
      </div>

      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No members yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sorted.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 text-center ${i === 0 ? "border-yellow-500/30 md:order-2" : i === 1 ? "border-gray-400/20 md:order-1" : "border-amber-700/20 md:order-3"}`}
              >
                <div className="flex justify-center mb-3">{rankIcons[i]}</div>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl mx-auto">
                  {p.name.charAt(0)}
                </div>
                <h3 className="font-bold text-foreground mt-3">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.department} • {p.year} Year</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Coins size={16} className="text-primary" />
                  <span className="font-mono text-2xl font-bold text-primary">{p.points}</span>
                </div>
                <p className="text-xs text-muted-foreground">points</p>
                <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold border ${getBadge(p.points).color}`}>
                  {getBadge(p.points).label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">RANK</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">MEMBER</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DEPT</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">POINTS</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">BADGE</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => {
                  const badge = getBadge(p.points);
                  return (
                    <tr key={p.user_id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-muted-foreground">#{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{p.name.charAt(0)}</div>
                          <span className="font-medium text-foreground">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.department}</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary">{p.points}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>{badge.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MemberLeaderboard;
