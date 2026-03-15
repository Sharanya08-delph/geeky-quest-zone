import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import { Flame, Target, Calendar, TrendingUp, AlertTriangle, Clock } from "lucide-react";

const MemberHome = () => {
  const { user } = useAuth();
  const { announcements } = useData();

  if (!user) return null;

  const highPriorityAnnouncements = announcements.filter(a => a.priority === "high");

  return (
    <div className="space-y-6">
      {/* Welcome & Streak */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground">Level up your code, RIT.</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 px-6 py-3 bg-streak-orange/10 border border-streak-orange/20 rounded-full self-start"
        >
          <span className="text-2xl animate-fire">🔥</span>
          <div>
            <span className="font-mono font-bold text-xl text-streak-orange">{user.streak} Days</span>
            <p className="text-xs text-muted-foreground">Coding Streak</p>
          </div>
        </motion.div>
      </div>

      {/* Important Reminders */}
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
                <p className="text-muted-foreground text-sm mt-1">{a.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Target size={16} /> Problems Solved
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{user.problemsSolved}</p>
          <p className="text-xs text-primary">You're 3 problems away from Top 10</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar size={16} /> Events Attended
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{user.eventsAttended}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, (user.eventsAttended / 20) * 100)}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingUp size={16} /> Global Rank
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">#{user.rank}</p>
          <p className="text-xs text-primary">RIT Campus Ranking</p>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Progress Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-primary mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-primary">{user.problemsSolved}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Problems Solved</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-streak-orange mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-streak-orange">{user.eventsAttended}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Events Attended</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-accent-foreground mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-accent-foreground">↑{Math.max(0, 50 - user.rank)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Ranking Improvement</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Achievement Badges</h2>
        <div className="flex flex-wrap gap-3">
          {user.badges.map((badge, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              🏆 {badge}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Announcements</h2>
        <div className="space-y-3">
          {announcements.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <Clock size={14} className="text-muted-foreground mt-1 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberHome;
