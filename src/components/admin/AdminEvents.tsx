import React, { useState } from "react";
import { useData, Event } from "@/contexts/DataContext";
import { Plus, Edit, Trash2, X } from "lucide-react";

const AdminEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", venue: "", type: "workshop" as Event["type"], status: "upcoming" as Event["status"], maxParticipants: 50 });

  const handleSubmit = () => {
    if (!form.title || !form.date) return;
    if (editId) {
      updateEvent(editId, form);
      setEditId(null);
    } else {
      addEvent({ ...form, registrations: [] });
    }
    setForm({ title: "", description: "", date: "", time: "", venue: "", type: "workshop", status: "upcoming", maxParticipants: 50 });
    setShowForm(false);
  };

  const startEdit = (e: Event) => {
    setForm({ title: e.title, description: e.description, date: e.date, time: e.time, venue: e.venue, type: e.type, status: e.status, maxParticipants: e.maxParticipants });
    setEditId(e.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Event Management</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); }} className="btn-primary text-sm py-2 flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event Title" className="input-field" />
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Event["type"] }))} className="input-field">
            <option value="hackathon">Hackathon</option>
            <option value="workshop">Workshop</option>
            <option value="contest">Contest</option>
            <option value="seminar">Seminar</option>
          </select>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
          <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="Time (e.g. 10:00 AM)" className="input-field" />
          <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="Venue" className="input-field" />
          <input type="number" value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: parseInt(e.target.value) }))} placeholder="Max Participants" className="input-field" />
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Event["status"] }))} className="input-field">
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="input-field resize-none md:col-span-2" rows={3} />
          <button onClick={handleSubmit} className="btn-primary text-sm py-2 md:col-span-2">{editId ? "Update" : "Create"} Event</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">EVENT</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">TYPE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DATE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">REGISTRATIONS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{e.title}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{e.type}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{e.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${e.status === "live" ? "bg-streak-red/15 text-streak-red" : e.status === "upcoming" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{e.status}</span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-foreground">{e.registrations.length}/{e.maxParticipants}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(e)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                  <button onClick={() => deleteEvent(e.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEvents;
