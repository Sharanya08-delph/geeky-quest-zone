import React, { useState } from "react";
import { FileText, Plus, ExternalLink, Trash2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

const AdminContent = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    { id: "1", title: "Welcome to GFG-RIT Campus Club", content: "We are excited to launch the GeeksforGeeks Campus Club at RIT! Join us for coding events, workshops, and much more.", date: "2026-01-15", author: "Admin" },
    { id: "2", title: "How to Get Started with DSA", content: "A comprehensive guide to starting your Data Structures and Algorithms journey.", date: "2026-02-10", author: "Admin" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const handleSubmit = () => {
    if (!form.title || !form.content) return;
    setPosts(prev => [{ id: Date.now().toString(), title: form.title, content: form.content, date: new Date().toISOString().split("T")[0], author: "Admin" }, ...prev]);
    setForm({ title: "", content: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><FileText size={24} className="text-primary" /> Content Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2 flex items-center gap-2"><Plus size={16} /> New Blog Post</button>
      </div>

      {showForm && (
        <div className="glass-card p-5 space-y-3">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Post Title" className="input-field" />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Post Content..." className="input-field resize-none h-32" />
          <button onClick={handleSubmit} className="btn-primary text-sm py-2">Publish Post</button>
        </div>
      )}

      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="glass-card-hover p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{p.content}</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">{p.date} • {p.author}</p>
              </div>
              <button onClick={() => setPosts(prev => prev.filter(post => post.id !== p.id))} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;
