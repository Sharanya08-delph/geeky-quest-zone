import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Plus, Edit, Trash2, X, Users, ChevronDown, ChevronUp } from "lucide-react";
import type { Event, EventRegistration } from "@/contexts/DataContext";

const AdminEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent, getEventRegistrations } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", venue: "", type: "workshop", status: "upcoming", max_participants: 50 });
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [eventRegs, setEventRegs] = useState<EventRegistration[]>([]);

  const handleSubmit = async () => {
    if (!form.title || !form.date) return;
    if (editId) {
      await updateEvent(editId, form);
      setEditId(null);
    } else {
      await addEvent({ ...form, description: form.description, created_by: null });
    }
    setForm({ title: "", description: "", date: "", time: "", venue: "", type: "workshop", status: "upcoming", max_participants: 50 });
    setShowForm(false);
  };

  const startEdit = (e: Event) => {
    setForm({ title: e.title, description: e.description || "", date: e.date, time: e.time || "", venue: e.venue || "", type: e.type, status: e.status, max_participants: e.max_participants || 50 });
    setEditId(e.id);
    setShowForm(true);
  };

  const toggleRegistrations = async (eventId: string) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
      return;
    }
    const regs = await getEventRegistrations(eventId);
    setEventRegs(regs);
    setExpandedEvent(eventId);
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
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
            <option value="hackathon">Hackathon</option>
            <option value="workshop">Workshop</option>
            <option value="contest">Contest</option>
            <option value="seminar">Seminar</option>
          </select>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
          <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="Time (e.g. 10:00 AM)" className="input-field" />
          <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="Venue" className="input-field" />
          <input type="number" value={form.max_participants} onChange={e => setForm(f => ({ ...f, max_participants: parseInt(e.target.value) }))} placeholder="Max Participants" className="input-field" />
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-field">
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="input-field resize-none md:col-span-2" rows={3} />
          <button onClick={handleSubmit} className="btn-primary text-sm py-2 md:col-span-2">{editId ? "Update" : "Create"} Event</button>
        </div>
      )}

      <div className="space-y-2">
        {events.map(e => (
          <div key={e.id} className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{e.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${e.status === "live" ? "bg-streak-red/15 text-streak-red" : e.status === "upcoming" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{e.status}</span>
                  <span className="text-xs text-muted-foreground capitalize">{e.type}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{e.date} • {e.venue}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleRegistrations(e.id)} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20">
                  <Users size={12} /> {e.registration_count || 0}/{e.max_participants}
                  {expandedEvent === e.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <button onClick={() => startEdit(e)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                <button onClick={() => deleteEvent(e.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>

            {expandedEvent === e.id && (
              <div className="border-t border-border p-4 bg-muted/30">
                <h4 className="text-sm font-medium text-foreground mb-2">Registered Participants ({eventRegs.length})</h4>
                {eventRegs.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No registrations yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted-foreground">
                        <th className="text-left py-1">Name</th>
                        <th className="text-left py-1">Email</th>
                        <th className="text-left py-1">Dept</th>
                        <th className="text-left py-1">Year</th>
                        <th className="text-left py-1">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRegs.map(r => (
                        <tr key={r.id} className="border-t border-border/30">
                          <td className="py-1.5 text-foreground">{r.name}</td>
                          <td className="py-1.5 text-muted-foreground font-mono text-xs">{r.email}</td>
                          <td className="py-1.5 text-muted-foreground">{r.department || "-"}</td>
                          <td className="py-1.5 text-muted-foreground">{r.year || "-"}</td>
                          <td className="py-1.5 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
