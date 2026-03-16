import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Megaphone, Plus } from "lucide-react";

const priorityColors: Record<string, string> = {
  high: "border-l-4 border-streak-red bg-streak-red/5",
  medium: "border-l-4 border-streak-orange bg-streak-orange/5",
  low: "border-l-4 border-primary bg-primary/5",
  normal: "border-l-4 border-border",
};

const AdminAnnouncements = () => {
  const { announcements, addAnnouncement } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "medium" });

  const handleSubmit = async () => {
    if (!form.title || !form.content) return;
    await addAnnouncement(form);
    setForm({ title: "", content: "", priority: "medium" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Megaphone size={24} className="text-primary" /> Announcements</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2 flex items-center gap-2"><Plus size={16} /> Post Announcement</button>
      </div>

      {showForm && (
        <div className="glass-card p-5 space-y-3">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement Title" className="input-field" />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Message..." className="input-field resize-none h-24" />
          <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="input-field w-auto">
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>
          <button onClick={handleSubmit} className="btn-primary text-sm py-2">Post</button>
        </div>
      )}

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-muted-foreground">No announcements yet.</p>
        ) : (
          announcements.map(a => (
            <div key={a.id} className={`glass-card p-5 ${priorityColors[a.priority] || priorityColors.normal}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
