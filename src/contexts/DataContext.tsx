import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: "hackathon" | "workshop" | "contest" | "seminar";
  status: "upcoming" | "live" | "completed";
  registrations: string[];
  maxParticipants: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: "high" | "medium" | "low";
}

export interface Resource {
  id: string;
  title: string;
  category: "tutorial" | "dsa" | "aptitude" | "link";
  url: string;
  description: string;
  addedDate: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  examples: { input: string; output: string }[];
  solvedBy: string[];
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  date: string;
  replies: { authorId: string; authorName: string; content: string; date: string }[];
  likes: number;
}

export interface PeerChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengedId: string;
  challengedName: string;
  problemId: string;
  problemTitle: string;
  status: "pending" | "accepted" | "completed";
  date: string;
}

interface DataContextType {
  events: Event[];
  announcements: Announcement[];
  resources: Resource[];
  problems: CodingProblem[];
  forumPosts: ForumPost[];
  challenges: PeerChallenge[];
  addEvent: (e: Omit<Event, "id">) => void;
  updateEvent: (id: string, e: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, "id">) => void;
  addResource: (r: Omit<Resource, "id">) => void;
  deleteResource: (id: string) => void;
  addForumPost: (p: Omit<ForumPost, "id">) => void;
  addReply: (postId: string, reply: ForumPost["replies"][0]) => void;
  addChallenge: (c: Omit<PeerChallenge, "id">) => void;
  solveProblem: (problemId: string, userId: string) => void;
}

const MOCK_EVENTS: Event[] = [
  { id: "1", title: "Internal Hackathon 2026", description: "24-hour coding marathon. Build innovative solutions for real-world problems.", date: "2026-03-20", time: "10:00 AM", venue: "Lab 301, CSE Block", type: "hackathon", status: "upcoming", registrations: ["2", "3"], maxParticipants: 50 },
  { id: "2", title: "DSA Workshop - Trees & Graphs", description: "Deep dive into advanced tree and graph algorithms with hands-on practice.", date: "2026-03-18", time: "2:00 PM", venue: "Seminar Hall A", type: "workshop", status: "upcoming", registrations: ["2", "3", "4"], maxParticipants: 100 },
  { id: "3", title: "Weekly Coding Contest #12", description: "Competitive programming contest with 4 problems across difficulty levels.", date: "2026-03-15", time: "7:00 PM", venue: "Online", type: "contest", status: "live", registrations: ["2", "3", "4", "5"], maxParticipants: 200 },
  { id: "4", title: "Placement Preparation Seminar", description: "Tips and strategies for cracking tech interviews at top companies.", date: "2026-03-10", time: "11:00 AM", venue: "Auditorium", type: "seminar", status: "completed", registrations: ["2", "3", "4"], maxParticipants: 150 },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "1", title: "🔥 Internal Hackathon Tomorrow!", message: "Don't forget! Internal Hackathon starts tomorrow at 10 AM in Lab 301. Bring your laptops and ideas!", date: "2026-03-19", priority: "high" },
  { id: "2", title: "Weekly Contest Results", message: "Congratulations to Rahul Dev for winning Contest #11! Check the leaderboard for full results.", date: "2026-03-14", priority: "medium" },
  { id: "3", title: "New DSA Resources Added", message: "We've added 20+ new practice problems for Dynamic Programming. Check the Resources tab!", date: "2026-03-12", priority: "low" },
];

const MOCK_RESOURCES: Resource[] = [
  { id: "1", title: "Complete DSA Roadmap", category: "tutorial", url: "https://www.geeksforgeeks.org/complete-roadmap-to-learn-dsa-from-scratch/", description: "Step-by-step guide to mastering Data Structures and Algorithms", addedDate: "2026-01-15" },
  { id: "2", title: "Array Practice Problems", category: "dsa", url: "https://www.geeksforgeeks.org/array-data-structure/", description: "50+ array problems from easy to hard", addedDate: "2026-02-01" },
  { id: "3", title: "Aptitude Questions for TCS", category: "aptitude", url: "https://www.geeksforgeeks.org/tcs-aptitude-questions/", description: "Previous year aptitude questions for TCS placement", addedDate: "2026-02-15" },
  { id: "4", title: "Graph Algorithms Tutorial", category: "tutorial", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/", description: "Comprehensive guide to graph algorithms with examples", addedDate: "2026-03-01" },
  { id: "5", title: "Dynamic Programming Patterns", category: "dsa", url: "https://www.geeksforgeeks.org/dynamic-programming/", description: "Common DP patterns and practice problems", addedDate: "2026-03-05" },
  { id: "6", title: "Infosys Aptitude Questions", category: "aptitude", url: "https://www.geeksforgeeks.org/infosys-aptitude-questions/", description: "Aptitude questions for Infosys recruitment", addedDate: "2026-03-10" },
];

const MOCK_PROBLEMS: CodingProblem[] = [
  { id: "1", title: "Two Sum", difficulty: "easy", category: "Arrays", description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.", examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }], solvedBy: ["2", "3", "4"] },
  { id: "2", title: "Longest Palindromic Substring", difficulty: "medium", category: "Strings", description: "Given a string s, return the longest palindromic substring in s.", examples: [{ input: 's = "babad"', output: '"bab"' }], solvedBy: ["3"] },
  { id: "3", title: "Merge K Sorted Lists", difficulty: "hard", category: "Linked Lists", description: "Merge k sorted linked lists and return it as one sorted list.", examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }], solvedBy: [] },
  { id: "4", title: "Valid Parentheses", difficulty: "easy", category: "Stacks", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", examples: [{ input: 's = "()"', output: "true" }], solvedBy: ["2", "3", "4", "5"] },
  { id: "5", title: "Binary Tree Level Order Traversal", difficulty: "medium", category: "Trees", description: "Given the root of a binary tree, return the level order traversal of its nodes' values.", examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }], solvedBy: ["3", "4"] },
  { id: "6", title: "Dijkstra's Shortest Path", difficulty: "hard", category: "Graphs", description: "Find the shortest path from source to all vertices in a weighted graph.", examples: [{ input: "graph = [[0,4,0],[4,0,8],[0,8,0]], src = 0", output: "[0,4,12]" }], solvedBy: ["3"] },
];

const MOCK_FORUM: ForumPost[] = [
  { id: "1", authorId: "2", authorName: "Priya Sharma", title: "How to approach DP problems?", content: "I'm struggling with dynamic programming. Any tips on how to identify the subproblems?", date: "2026-03-14", replies: [{ authorId: "3", authorName: "Rahul Dev", content: "Start with recognizing overlapping subproblems. Try breaking the problem into smaller versions of itself.", date: "2026-03-14" }], likes: 8 },
  { id: "2", authorId: "4", authorName: "Sneha Patel", title: "Best resources for System Design?", content: "Can anyone recommend good resources for learning system design concepts?", date: "2026-03-13", replies: [], likes: 5 },
];

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(() => JSON.parse(localStorage.getItem("gfg_events") || "null") || MOCK_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => JSON.parse(localStorage.getItem("gfg_announcements") || "null") || MOCK_ANNOUNCEMENTS);
  const [resources, setResources] = useState<Resource[]>(() => JSON.parse(localStorage.getItem("gfg_resources") || "null") || MOCK_RESOURCES);
  const [problems] = useState<CodingProblem[]>(MOCK_PROBLEMS);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => JSON.parse(localStorage.getItem("gfg_forum") || "null") || MOCK_FORUM);
  const [challenges, setChallenges] = useState<PeerChallenge[]>([]);

  useEffect(() => { localStorage.setItem("gfg_events", JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem("gfg_announcements", JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem("gfg_resources", JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem("gfg_forum", JSON.stringify(forumPosts)); }, [forumPosts]);

  const addEvent = (e: Omit<Event, "id">) => setEvents(prev => [...prev, { ...e, id: Date.now().toString() }]);
  const updateEvent = (id: string, e: Partial<Event>) => setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...e } : ev));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(ev => ev.id !== id));
  const addAnnouncement = (a: Omit<Announcement, "id">) => setAnnouncements(prev => [{ ...a, id: Date.now().toString() }, ...prev]);
  const addResource = (r: Omit<Resource, "id">) => setResources(prev => [...prev, { ...r, id: Date.now().toString() }]);
  const deleteResource = (id: string) => setResources(prev => prev.filter(r => r.id !== id));
  const addForumPost = (p: Omit<ForumPost, "id">) => setForumPosts(prev => [{ ...p, id: Date.now().toString() }, ...prev]);
  const addReply = (postId: string, reply: ForumPost["replies"][0]) => setForumPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: [...p.replies, reply] } : p));
  const addChallenge = (c: Omit<PeerChallenge, "id">) => setChallenges(prev => [...prev, { ...c, id: Date.now().toString() }]);
  const solveProblem = (problemId: string, userId: string) => {
    // This would update in a real DB
  };

  return (
    <DataContext.Provider value={{ events, announcements, resources, problems, forumPosts, challenges, addEvent, updateEvent, deleteEvent, addAnnouncement, addResource, deleteResource, addForumPost, addReply, addChallenge, solveProblem }}>
      {children}
    </DataContext.Provider>
  );
};
