import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { User, Mail, Phone, Building, GraduationCap, Hash, Save, Coins } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const MemberProfile = () => {
  const { profile, profiles, updateProfile } = useAuth();
  const { submissions, registrations } = useData();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: profile?.name || "", phone: profile?.phone || "", department: profile?.department || "", year: profile?.year || "" });

  if (!profile) return null;

  const problemsSolved = submissions.filter(s => s.status === "accepted").length;
  const eventsAttended = registrations.length;
  const rank = profiles.findIndex(p => p.user_id === profile.user_id) + 1;

  const handleSave = async () => {
    await updateProfile(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

      <div className="glass-card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.department} • {profile.year} Year</p>
            <div className="flex items-center gap-1 mt-1 text-primary font-bold">
              <Coins size={16} /> {profile.points} points
            </div>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><User size={14} /> Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Phone size={14} /> Phone</label>
              <input value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Building size={14} /> Department</label>
              <input value={form.department || ""} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><GraduationCap size={14} /> Year</label>
              <input value={form.year || ""} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="input-field" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary text-sm py-2 flex items-center gap-2"><Save size={14} /> Save</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={12} /> Email</p>
                <p className="text-sm font-medium text-foreground font-mono mt-1">{profile.email}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={12} /> Phone</p>
                <p className="text-sm font-medium text-foreground font-mono mt-1">{profile.phone || "-"}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Hash size={12} /> Register No.</p>
                <p className="text-sm font-medium text-foreground font-mono mt-1">{profile.register_number || "-"}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Building size={12} /> Department</p>
                <p className="text-sm font-medium text-foreground font-mono mt-1">{profile.department || "-"}</p>
              </div>
            </div>
            <button onClick={() => setEditing(true)} className="btn-primary text-sm py-2">Edit Profile</button>
          </div>
        )}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Achievements & Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-mono text-2xl font-bold text-primary">{problemsSolved}</p>
            <p className="text-xs text-muted-foreground">Problems Solved</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-primary">{profile.points}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-foreground">{eventsAttended}</p>
            <p className="text-xs text-muted-foreground">Events Registered</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-accent-foreground">#{rank || "-"}</p>
            <p className="text-xs text-muted-foreground">Campus Rank</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
