import React from "react";
import { useData } from "@/contexts/DataContext";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

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
  const { events } = useData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Event Participation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(event => (
          <div key={event.id} className="glass-card-hover p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${typeColors[event.type]}`}>
                  {event.type.toUpperCase()}
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-2">{event.title}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[event.status]}`}>
                {event.status === "live" && "● "}{event.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar size={14} />{event.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} />{event.time}</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{event.venue}</span>
              <span className="flex items-center gap-1"><Users size={14} />{event.registrations.length}/{event.maxParticipants}</span>
            </div>
            {event.status !== "completed" && (
              <button className="btn-primary text-sm py-2">Register Now</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberEvents;
