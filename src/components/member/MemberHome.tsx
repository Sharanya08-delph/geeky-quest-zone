import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import { Flame, Target, Calendar, TrendingUp, AlertTriangle, Clock, Coins } from "lucide-react";

const MemberHome = () => {
  const { profile, profiles } = useAuth();
  const { announcements, submissions, registrations } = useData();

  if (!profile) return null;

  const highPriorityAnnouncements = announcements.filter(a => a.priority === "high");
  const problemsSolved = submissions.filter(s => s.status === "accepted").length;
  const eventsAttended = registrations.length;
  const rank = profiles.findIndex(p => p.user_id === profile.user_id) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, <span className="gradient-text">{profile.name.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground">Level up your code, RIT.</p>
        </div>

        <div className="flex items-center gap-4 self-start">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
          >
            <Coins size={18} className="text-primary" />
            <span className="font-mono font-bold text-lg text-primary">{profile.points}</span>
            <span className="text-xs text-muted-foreground">points</span>
          </motion.div>
        </div>
      </div>

      {highPriorityAnnouncements.length > 0 && (
        <div className="space-y-3">
          {highPriorityAnnouncements.map(a => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 border-l-4 border-streak-orange flex items-start gap-3"
            >
              <AlertTriangle className="text-streak-orange mt-0.5 shrink-0" size={18} />
              <div>
                <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{a.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Target size={16} /> Problems Solved
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{problemsSolved}</p>
          <p className="text-xs text-primary">{profile.points} points earned</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar size={16} /> Events Registered
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{eventsAttended}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, (eventsAttended / 20) * 100)}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingUp size={16} /> Global Rank
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">#{rank || "-"}</p>
          <p className="text-xs text-primary">RIT Campus Ranking</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Progress Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-primary mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-primary">{problemsSolved}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Problems Solved</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-streak-orange mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-streak-orange">{eventsAttended}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Events Registered</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-primary mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-primary">{profile.points}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total Points</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Announcements</h2>
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          ) : (
            announcements.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <Clock size={14} className="text-muted-foreground mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberHome;
