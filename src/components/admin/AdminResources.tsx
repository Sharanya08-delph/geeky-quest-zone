import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Plus, Trash2, ExternalLink } from "lucide-react";

const AdminResources = () => {
  const { resources, addResource, deleteResource } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "tutorial" as "tutorial" | "dsa" | "aptitude" | "link", url: "", description: "" });

  const handleSubmit = () => {
    if (!form.title || !form.url) return;
    addResource({ ...form, addedDate: new Date().toISOString().split("T")[0] });
    setForm({ title: "", category: "tutorial", url: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Resource Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2 flex items-center gap-2">
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Resource Title" className="input-field" />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof form.category }))} className="input-field">
            <option value="tutorial">Tutorial</option>
            <option value="dsa">DSA Practice</option>
            <option value="aptitude">Aptitude</option>
            <option value="link">Link</option>
          </select>
          <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="URL" className="input-field" />
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="input-field" />
          <button onClick={handleSubmit} className="btn-primary text-sm py-2 md:col-span-2">Add Resource</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">TITLE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CATEGORY</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ADDED</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(r => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{r.title}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{r.category}</td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{r.addedDate}</td>
                <td className="px-4 py-3 flex gap-2">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><ExternalLink size={14} /></a>
                  <button onClick={() => deleteResource(r.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminResources;
