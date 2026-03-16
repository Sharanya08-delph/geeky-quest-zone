import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, MapPin, Clock, Users, X, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/sonner";

const typeColors: Record<string, string> = {
  hackathon: "bg-streak-orange/10 text-streak-orange border-streak-orange/20",
  workshop: "bg-primary/10 text-primary border-primary/20",
  contest: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  seminar: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const statusColors: Record<string, string> = {
  upcoming: "bg-primary/15 text-primary",
  live: "bg-streak-red/15 text-streak-red animate-pulse",
  completed: "bg-muted text-muted-foreground",
};

const MemberEvents = () => {
  const { events, registrations, registerForEvent } = useData();
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: "", year: "", phone: "" });

  const isRegistered = (eventId: string) => registrations.some(r => r.event_id === eventId);

  const openForm = (eventId: string) => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        department: profile.department || "",
        year: profile.year || "",
        phone: profile.phone || "",
      });
    }
    setShowForm(eventId);
  };

  const handleRegister = async () => {
    if (!showForm || !form.name || !form.email) return;
    setSubmitting(true);
    const { error } = await registerForEvent(showForm, form);
    setSubmitting(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Successfully registered for the event!");
      setShowForm(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Event Participation</h1>

      {/* Registration Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Event Registration</h3>
                <button onClick={() => setShowForm(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Department</label>
                  <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Year</label>
                  <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
                </div>
              </div>
              <button onClick={handleRegister} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : "Register Now"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground col-span-2 text-center py-8">No events yet. Check back later!</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="glass-card-hover p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${typeColors[event.type] || typeColors.workshop}`}>
                    {event.type.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-2">{event.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[event.status] || statusColors.upcoming}`}>
                  {event.status === "live" && "● "}{event.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={14} />{event.date}</span>
                {event.time && <span className="flex items-center gap-1"><Clock size={14} />{event.time}</span>}
                {event.venue && <span className="flex items-center gap-1"><MapPin size={14} />{event.venue}</span>}
                <span className="flex items-center gap-1"><Users size={14} />{event.registration_count || 0}/{event.max_participants}</span>
              </div>
              {event.status !== "completed" && (
                isRegistered(event.id) ? (
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <CheckCircle size={16} /> Registered
                  </div>
                ) : (
                  <button onClick={() => openForm(event.id)} className="btn-primary text-sm py-2">Register Now</button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberEvents;
