import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";

export type Json = any;

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
  url: string;
  description: string;
  category: string;
  created_by: string | null;
  created_at: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
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
  created_at: string;
  challenger_name?: string;
  challenged_name?: string;
  problem_title?: string;
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

// Mock data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Coding Competition",
    description: "Annual coding competition",
    date: "2024-04-15",
    time: "10:00 AM",
    venue: "Computer Lab",
    type: "competition",
    status: "upcoming",
    max_participants: 50,
    created_by: "1",
    registration_count: 0,
  },
  {
    id: "2",
    title: "Workshop on React",
    description: "Learn React fundamentals",
    date: "2024-04-20",
    time: "2:00 PM",
    venue: "Seminar Hall",
    type: "workshop",
    status: "upcoming",
    max_participants: 30,
    created_by: "1",
    registration_count: 0,
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to Geeky Quest Zone",
    content: "Get ready for exciting coding challenges and events!",
    priority: "high",
    created_by: "1",
    created_at: new Date().toISOString(),
  }
];

const mockResources: Resource[] = [
  {
    id: "1",
    title: "JavaScript Guide",
    type: "document",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description: "Comprehensive JavaScript guide",
    category: "Programming",
    created_by: "1",
    created_at: new Date().toISOString(),
  }
];

const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    category: "Algorithms",
    description: "Find two numbers that add up to target",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Binary Tree Traversal",
    difficulty: "medium",
    category: "Data Structures",
    description: "Traverse a binary tree in-order",
    created_at: new Date().toISOString(),
  }
];

const mockForumPosts: ForumPost[] = [
  {
    id: "1",
    user_id: "1",
    title: "Best practices for React hooks",
    content: "Share your tips and tricks for using React hooks effectively.",
    created_at: new Date().toISOString(),
    author_name: "Admin User",
    replies: [],
  }
];

const mockChallenges: PeerChallenge[] = [];

const mockSubmissions: ProblemSubmission[] = [];

const mockRegistrations: EventRegistration[] = [];

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
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(mockForumPosts);
  const [challenges, setChallenges] = useState<PeerChallenge[]>(mockChallenges);
  const [submissions, setSubmissions] = useState<ProblemSubmission[]>(mockSubmissions);
  const [registrations, setRegistrations] = useState<EventRegistration[]>(mockRegistrations);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setEvents(mockEvents);
  };

  const fetchAnnouncements = async () => {
    setAnnouncements(mockAnnouncements);
  };

  const fetchResources = async () => {
    setResources(mockResources);
  };

  const fetchProblems = async () => {
    setProblems(mockProblems);
  };

  const fetchForumPosts = async () => {
    setForumPosts(mockForumPosts);
  };

  const fetchChallenges = async () => {
    if (!user) return;
    setChallenges(mockChallenges);
  };

  const fetchSubmissions = async () => {
    if (!user) return;
    setSubmissions(mockSubmissions);
  };

  const fetchRegistrations = async () => {
    if (!user) return;
    setRegistrations(mockRegistrations);
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
  }, [user, refreshAll]);

  const addEvent = async (e: Omit<Event, "id" | "registration_count">) => {
    const newEvent: Event = {
      ...e,
      id: Date.now().toString(),
      created_by: user?.id || null,
    };
    mockEvents.push(newEvent);
    setEvents([...mockEvents]);
  };

  const updateEvent = async (id: string, e: Partial<Event>) => {
    const index = mockEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...e };
      setEvents([...mockEvents]);
    }
  };

  const deleteEvent = async (id: string) => {
    const index = mockEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      mockEvents.splice(index, 1);
      setEvents([...mockEvents]);
    }
  };

  const addAnnouncement = async (a: { title: string; content: string; priority: string }) => {
    const newAnnouncement: Announcement = {
      ...a,
      id: Date.now().toString(),
      created_by: user?.id || null,
      created_at: new Date().toISOString(),
    };
    mockAnnouncements.push(newAnnouncement);
    setAnnouncements([...mockAnnouncements]);
  };

  const addResource = async (r: { title: string; type: string; url: string; description: string; category: string }) => {
    const newResource: Resource = {
      ...r,
      id: Date.now().toString(),
      created_by: user?.id || null,
      created_at: new Date().toISOString(),
    };
    mockResources.push(newResource);
    setResources([...mockResources]);
  };

  const deleteResource = async (id: string) => {
    const index = mockResources.findIndex(resource => resource.id === id);
    if (index !== -1) {
      mockResources.splice(index, 1);
      setResources([...mockResources]);
    }
  };

  const addForumPost = async (p: { title: string; content: string }) => {
    if (!user) return;
    const newPost: ForumPost = {
      ...p,
      id: Date.now().toString(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      author_name: profile?.name || "Unknown",
      replies: [],
    };
    mockForumPosts.push(newPost);
    setForumPosts([...mockForumPosts]);
  };

  const addReply = async (postId: string, content: string) => {
    if (!user) return;
    const newReply: ForumReply = {
      id: Date.now().toString(),
      post_id: postId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      author_name: profile?.name || "Unknown",
    };
    
    const postIndex = mockForumPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      if (!mockForumPosts[postIndex].replies) {
        mockForumPosts[postIndex].replies = [];
      }
      mockForumPosts[postIndex].replies!.push(newReply);
      setForumPosts([...mockForumPosts]);
    }
  };

  const submitSolution = async (problemId: string, code: string, language: string) => {
    if (!user || !profile) return null;
    const problem = mockProblems.find(p => p.id === problemId);
    if (!problem) return null;

    // Check if already solved
    const existing = submissions.find(s => s.problem_id === problemId && s.status === "accepted");
    if (existing) return null;

    const pointsMap: Record<string, number> = { easy: 5, medium: 15, hard: 30 };
    const pointsEarned = pointsMap[problem.difficulty] || 5;

    const newSubmission: ProblemSubmission = {
      id: Date.now().toString(),
      problem_id: problemId,
      user_id: user.id,
      code,
      language,
      status: "accepted",
      points_earned: pointsEarned,
      created_at: new Date().toISOString(),
    };
    mockSubmissions.push(newSubmission);
    setSubmissions([...mockSubmissions]);

    // Update user points
    profile.points += pointsEarned;
    refreshProfiles();

    return { pointsEarned };
  };

  const registerForEvent = async (eventId: string, formData: { name: string; email: string; department: string; year: string; phone: string }) => {
    if (!user) return { error: "Not logged in" };

    const existing = registrations.find(r => r.event_id === eventId);
    if (existing) return { error: "Already registered" };

    const newRegistration: EventRegistration = {
      id: Date.now().toString(),
      event_id: eventId,
      user_id: user.id,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      year: formData.year,
      phone: formData.phone,
      created_at: new Date().toISOString(),
    };
    mockRegistrations.push(newRegistration);
    setRegistrations([...mockRegistrations]);

    // Update registration count
    const eventIndex = mockEvents.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      mockEvents[eventIndex].registration_count = (mockEvents[eventIndex].registration_count || 0) + 1;
      setEvents([...mockEvents]);
    }

    return { error: null };
  };

  const createChallenge = async (challengedId: string, problemId: string, betAmount: number) => {
    if (!user || !profile) return { error: "Not logged in" };
    if (betAmount < 5 || betAmount > 50) return { error: "Bet must be between 5 and 50 points" };
    if (profile.points < betAmount) return { error: "Insufficient points" };

    // Deduct points from challenger
    profile.points -= betAmount;
    refreshProfiles();

    const newChallenge: PeerChallenge = {
      id: Date.now().toString(),
      challenger_id: user.id,
      challenged_id: challengedId,
      problem_id: problemId,
      bet_amount: betAmount,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    mockChallenges.push(newChallenge);
    setChallenges([...mockChallenges]);

    return { error: null };
  };

  const acceptChallenge = async (challengeId: string) => {
    if (!user || !profile) return;
    const challenge = mockChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.challenged_id !== user.id) return;
    if (profile.points < challenge.bet_amount) return;

    // Deduct points from challenged
    profile.points -= challenge.bet_amount;
    refreshProfiles();

    const index = mockChallenges.findIndex(c => c.id === challengeId);
    if (index !== -1) {
      mockChallenges[index].status = "accepted";
      setChallenges([...mockChallenges]);
    }
  };

  const getEventRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
    return mockRegistrations.filter(reg => reg.event_id === eventId);
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
