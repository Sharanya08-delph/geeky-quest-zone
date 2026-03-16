import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import type { Json } from "@/integrations/supabase/types";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  venue: string | null;
  type: string;
  status: string;
  max_participants: number | null;
  created_by: string | null;
  registration_count?: number;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  name: string;
  email: string;
  department: string | null;
  year: string | null;
  phone: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_by: string | null;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  url: string | null;
  description: string | null;
  category: string | null;
  created_at: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string | null;
  description: string;
  examples: Json;
  points: number;
}

export interface ProblemSubmission {
  id: string;
  problem_id: string;
  user_id: string;
  code: string;
  language: string;
  status: string;
  points_earned: number;
  created_at: string;
}

export interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  likes: number | null;
  created_at: string;
  author_name?: string;
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name?: string;
}

export interface PeerChallenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  problem_id: string;
  bet_amount: number;
  status: string;
  winner_id: string | null;
  created_at: string;
  challenger_name?: string;
  challenged_name?: string;
  problem_title?: string;
}

interface DataContextType {
  events: Event[];
  announcements: Announcement[];
  resources: Resource[];
  problems: Problem[];
  forumPosts: ForumPost[];
  challenges: PeerChallenge[];
  submissions: ProblemSubmission[];
  registrations: EventRegistration[];
  loading: boolean;
  addEvent: (e: Omit<Event, "id" | "registration_count">) => Promise<void>;
  updateEvent: (id: string, e: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addAnnouncement: (a: { title: string; content: string; priority: string }) => Promise<void>;
  addResource: (r: { title: string; type: string; url: string; description: string; category: string }) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  addForumPost: (p: { title: string; content: string }) => Promise<void>;
  addReply: (postId: string, content: string) => Promise<void>;
  submitSolution: (problemId: string, code: string, language: string) => Promise<{ pointsEarned: number } | null>;
  registerForEvent: (eventId: string, formData: { name: string; email: string; department: string; year: string; phone: string }) => Promise<{ error: string | null }>;
  createChallenge: (challengedId: string, problemId: string, betAmount: number) => Promise<{ error: string | null }>;
  acceptChallenge: (challengeId: string) => Promise<void>;
  getEventRegistrations: (eventId: string) => Promise<EventRegistration[]>;
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile, refreshProfiles } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [challenges, setChallenges] = useState<PeerChallenge[]>([]);
  const [submissions, setSubmissions] = useState<ProblemSubmission[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: false });
    if (data) {
      // Get registration counts
      const eventsWithCounts = await Promise.all(
        data.map(async (event) => {
          const { count } = await supabase
            .from("event_registrations")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id);
          return { ...event, registration_count: count || 0 } as Event;
        })
      );
      setEvents(eventsWithCounts);
    }
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (data) setAnnouncements(data as Announcement[]);
  };

  const fetchResources = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    if (data) setResources(data as Resource[]);
  };

  const fetchProblems = async () => {
    const { data } = await supabase.from("problems").select("*").order("difficulty");
    if (data) setProblems(data as Problem[]);
  };

  const fetchForumPosts = async () => {
    const { data: posts } = await supabase.from("forum_posts").select("*").order("created_at", { ascending: false });
    if (!posts) return;

    const { data: allProfiles } = await supabase.from("profiles").select("user_id, name");
    const profileMap = new Map((allProfiles || []).map(p => [p.user_id, p.name]));

    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const { data: replies } = await supabase.from("forum_replies").select("*").eq("post_id", post.id).order("created_at");
        return {
          ...post,
          author_name: profileMap.get(post.user_id) || "Unknown",
          replies: (replies || []).map(r => ({ ...r, author_name: profileMap.get(r.user_id) || "Unknown" })),
        } as ForumPost;
      })
    );
    setForumPosts(postsWithReplies);
  };

  const fetchChallenges = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("peer_challenges")
      .select("*")
      .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (!data) return;

    const { data: allProfiles } = await supabase.from("profiles").select("user_id, name");
    const { data: allProblems } = await supabase.from("problems").select("id, title");
    const profileMap = new Map((allProfiles || []).map(p => [p.user_id, p.name]));
    const problemMap = new Map((allProblems || []).map(p => [p.id, p.title]));

    setChallenges(data.map(c => ({
      ...c,
      challenger_name: profileMap.get(c.challenger_id) || "Unknown",
      challenged_name: profileMap.get(c.challenged_id) || "Unknown",
      problem_title: problemMap.get(c.problem_id) || "Unknown",
    })) as PeerChallenge[]);
  };

  const fetchSubmissions = async () => {
    if (!user) return;
    const { data } = await supabase.from("problem_submissions").select("*").eq("user_id", user.id);
    if (data) setSubmissions(data as ProblemSubmission[]);
  };

  const fetchRegistrations = async () => {
    if (!user) return;
    const { data } = await supabase.from("event_registrations").select("*").eq("user_id", user.id);
    if (data) setRegistrations(data as EventRegistration[]);
  };

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchEvents(),
      fetchAnnouncements(),
      fetchResources(),
      fetchProblems(),
      fetchForumPosts(),
      fetchChallenges(),
      fetchSubmissions(),
      fetchRegistrations(),
    ]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshAll();
    }
  }, [user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const eventsChannel = supabase.channel("events-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => fetchEvents())
      .subscribe();
    const announcementsChannel = supabase.channel("announcements-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () => fetchAnnouncements())
      .subscribe();
    const resourcesChannel = supabase.channel("resources-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "resources" }, () => fetchResources())
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(resourcesChannel);
    };
  }, [user]);

  const addEvent = async (e: Omit<Event, "id" | "registration_count">) => {
    await supabase.from("events").insert({
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      venue: e.venue,
      type: e.type,
      status: e.status,
      max_participants: e.max_participants,
      created_by: user?.id,
    });
    await fetchEvents();
  };

  const updateEvent = async (id: string, e: Partial<Event>) => {
    const { registration_count, ...updateData } = e;
    await supabase.from("events").update(updateData).eq("id", id);
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    await fetchEvents();
  };

  const addAnnouncement = async (a: { title: string; content: string; priority: string }) => {
    await supabase.from("announcements").insert({ ...a, created_by: user?.id });
    await fetchAnnouncements();
  };

  const addResource = async (r: { title: string; type: string; url: string; description: string; category: string }) => {
    await supabase.from("resources").insert({ ...r, created_by: user?.id });
    await fetchResources();
  };

  const deleteResource = async (id: string) => {
    await supabase.from("resources").delete().eq("id", id);
    await fetchResources();
  };

  const addForumPost = async (p: { title: string; content: string }) => {
    if (!user) return;
    await supabase.from("forum_posts").insert({ ...p, user_id: user.id });
    await fetchForumPosts();
  };

  const addReply = async (postId: string, content: string) => {
    if (!user) return;
    await supabase.from("forum_replies").insert({ post_id: postId, user_id: user.id, content });
    await fetchForumPosts();
  };

  const submitSolution = async (problemId: string, code: string, language: string) => {
    if (!user || !profile) return null;
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return null;

    // Check if already solved
    const existing = submissions.find(s => s.problem_id === problemId && s.status === "accepted");
    if (existing) return null;

    const pointsMap: Record<string, number> = { easy: 5, medium: 15, hard: 30 };
    const pointsEarned = pointsMap[problem.difficulty] || 5;

    await supabase.from("problem_submissions").insert({
      problem_id: problemId,
      user_id: user.id,
      code,
      language,
      status: "accepted",
      points_earned: pointsEarned,
    });

    // Update user points
    await supabase.from("profiles").update({ points: profile.points + pointsEarned }).eq("user_id", user.id);

    await fetchSubmissions();
    await refreshProfiles();
    return { pointsEarned };
  };

  const registerForEvent = async (eventId: string, formData: { name: string; email: string; department: string; year: string; phone: string }) => {
    if (!user) return { error: "Not logged in" };

    const existing = registrations.find(r => r.event_id === eventId);
    if (existing) return { error: "Already registered" };

    const { error } = await supabase.from("event_registrations").insert({
      event_id: eventId,
      user_id: user.id,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      year: formData.year,
      phone: formData.phone,
    });

    if (error) return { error: error.message };
    await fetchRegistrations();
    await fetchEvents();
    return { error: null };
  };

  const createChallenge = async (challengedId: string, problemId: string, betAmount: number) => {
    if (!user || !profile) return { error: "Not logged in" };
    if (betAmount < 5 || betAmount > 50) return { error: "Bet must be between 5 and 50 points" };
    if (profile.points < betAmount) return { error: "Insufficient points" };

    // Deduct points from challenger
    await supabase.from("profiles").update({ points: profile.points - betAmount }).eq("user_id", user.id);

    const { error } = await supabase.from("peer_challenges").insert({
      challenger_id: user.id,
      challenged_id: challengedId,
      problem_id: problemId,
      bet_amount: betAmount,
      status: "pending",
    });

    if (error) return { error: error.message };
    await fetchChallenges();
    await refreshProfiles();
    return { error: null };
  };

  const acceptChallenge = async (challengeId: string) => {
    if (!user || !profile) return;
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.challenged_id !== user.id) return;
    if (profile.points < challenge.bet_amount) return;

    // Deduct points from challenged
    await supabase.from("profiles").update({ points: profile.points - challenge.bet_amount }).eq("user_id", user.id);
    await supabase.from("peer_challenges").update({ status: "accepted" }).eq("id", challengeId);
    await fetchChallenges();
    await refreshProfiles();
  };

  const getEventRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
    const { data } = await supabase.from("event_registrations").select("*").eq("event_id", eventId);
    return (data || []) as EventRegistration[];
  };

  return (
    <DataContext.Provider value={{
      events, announcements, resources, problems, forumPosts, challenges, submissions, registrations, loading,
      addEvent, updateEvent, deleteEvent, addAnnouncement, addResource, deleteResource,
      addForumPost, addReply, submitSolution, registerForEvent, createChallenge, acceptChallenge,
      getEventRegistrations, refreshAll,
    }}>
      {children}
    </DataContext.Provider>
  );
};
