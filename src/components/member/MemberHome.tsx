import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Flame, Target, Calendar, TrendingUp, AlertTriangle, Clock, Coins, Search } from "lucide-react";

const MemberHome = () => {
  const { user, profile, profiles } = useAuth();
  const { announcements, submissions, registrations, events, resources, problems } = useData();
  const [streak, setStreak] = useState({ streak_count: 0, longest_streak: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    const updateStreak = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("daily_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!data) {
        await supabase.from("daily_streaks").insert({
          user_id: user.id,
          streak_count: 1,
          last_active_date: today,
          longest_streak: 1,
        });
        setStreak({ streak_count: 1, longest_streak: 1 });
      } else {
        const lastDate = new Date(data.last_active_date);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          setStreak({ streak_count: data.streak_count, longest_streak: data.longest_streak });
        } else if (diffDays === 1) {
          const newStreak = data.streak_count + 1;
          const newLongest = Math.max(newStreak, data.longest_streak);
          await supabase.from("daily_streaks").update({
            streak_count: newStreak,
            last_active_date: today,
            longest_streak: newLongest,
          }).eq("user_id", user.id);
          setStreak({ streak_count: newStreak, longest_streak: newLongest });
        } else {
          await supabase.from("daily_streaks").update({
            streak_count: 1,
            last_active_date: today,
            longest_streak: data.longest_streak,
          }).eq("user_id", user.id);
          setStreak({ streak_count: 1, longest_streak: data.longest_streak });
        }
      }
    };
    updateStreak();
  }, [user]);

  if (!profile) return null;

  const highPriorityAnnouncements = announcements.filter(a => a.priority === "high");
  const problemsSolved = submissions.filter(s => s.status === "accepted").length;
  const eventsAttended = registrations.length;
  const rank = profiles.findIndex(p => p.user_id === profile.user_id) + 1;

  // Search filtering
  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search announcements, events, resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card/80 backdrop-blur text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, <span className="gradient-text">{profile.name.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground">Level up your code, RIT.</p>
        </div>

        <div className="flex items-center gap-3 self-start flex-wrap">
          {/* Daily Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame size={20} className="text-orange-500" />
            </motion.div>
            <span className="font-mono font-bold text-lg text-orange-500">{streak.streak_count}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </motion.div>

          {/* Points */}
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
              className="glass-card p-4 border-l-4 border-orange-500 flex items-start gap-3"
            >
              <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={18} />
              <div>
                <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{a.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Flame size={16} className="text-orange-500" /> Daily Streak
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold font-mono text-orange-500">{streak.streak_count}</p>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
          <p className="text-xs text-muted-foreground">Best: {streak.longest_streak} days 🔥</p>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-orange-500 mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-orange-500">🔥{streak.streak_count}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Daily Streak</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-primary mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-primary">{problemsSolved}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Problems Solved</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-orange-500 mx-auto flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-orange-500">{eventsAttended}</span>
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
          {filteredAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground">{searchQuery ? "No matching announcements." : "No announcements yet."}</p>
          ) : (
            filteredAnnouncements.slice(0, 5).map(a => (
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
