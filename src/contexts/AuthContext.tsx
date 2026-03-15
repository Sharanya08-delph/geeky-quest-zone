import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  registerNumber: string;
  role: "member" | "admin";
  avatar?: string;
  problemsSolved: number;
  eventsAttended: number;
  rank: number;
  streak: number;
  badges: string[];
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string, role: "member" | "admin") => boolean;
  register: (userData: Omit<User, "id" | "problemsSolved" | "eventsAttended" | "rank" | "streak" | "badges" | "joinedDate">, password: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const ADMIN_EMAILS = ["lead.gfgrit@gmail.com", "admin.rit@gfg.com"];

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1", name: "Arun Kumar", email: "lead.gfgrit@gmail.com", phone: "9876543210",
    department: "CSE", year: "3rd", registerNumber: "RA2111003010001", role: "admin",
    problemsSolved: 342, eventsAttended: 15, rank: 1, streak: 45, password: "admin123",
    badges: ["DSA Master", "Contest Winner", "Mentor"], joinedDate: "2024-01-15",
  },
  {
    id: "2", name: "Priya Sharma", email: "priya@gfg.com", phone: "9876543211",
    department: "ECE", year: "2nd", registerNumber: "RA2111003010002", role: "member",
    problemsSolved: 156, eventsAttended: 8, rank: 5, streak: 12, password: "member123",
    badges: ["Problem Solver", "Active Member"], joinedDate: "2024-03-10",
  },
  {
    id: "3", name: "Rahul Dev", email: "rahul@gfg.com", phone: "9876543212",
    department: "IT", year: "4th", registerNumber: "RA2111003010003", role: "member",
    problemsSolved: 289, eventsAttended: 12, rank: 2, streak: 30, password: "member123",
    badges: ["DSA Pro", "Hackathon Winner", "Streak Master"], joinedDate: "2024-02-20",
  },
  {
    id: "4", name: "Sneha Patel", email: "sneha@gfg.com", phone: "9876543213",
    department: "CSE", year: "3rd", registerNumber: "RA2111003010004", role: "member",
    problemsSolved: 210, eventsAttended: 10, rank: 3, streak: 22, password: "member123",
    badges: ["Consistent Coder", "Event Star"], joinedDate: "2024-01-25",
  },
  {
    id: "5", name: "Vikash Singh", email: "vikash@gfg.com", phone: "9876543214",
    department: "MECH", year: "2nd", registerNumber: "RA2111003010005", role: "member",
    problemsSolved: 98, eventsAttended: 5, rank: 8, streak: 7, password: "member123",
    badges: ["Beginner"], joinedDate: "2024-06-01",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<(User & { password: string })[]>(() => {
    const stored = localStorage.getItem("gfg_users");
    return stored ? JSON.parse(stored) : MOCK_USERS;
  });

  useEffect(() => {
    const stored = localStorage.getItem("gfg_current_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("gfg_users", JSON.stringify(allUsers));
  }, [allUsers]);

  const login = (email: string, password: string, role: "member" | "admin"): boolean => {
    if (role === "admin" && !ADMIN_EMAILS.includes(email)) return false;
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (!found) return false;
    const { password: _, ...userData } = found;
    const loggedIn = { ...userData, role };
    setUser(loggedIn);
    localStorage.setItem("gfg_current_user", JSON.stringify(loggedIn));
    return true;
  };

  const register = (userData: Omit<User, "id" | "problemsSolved" | "eventsAttended" | "rank" | "streak" | "badges" | "joinedDate">, password: string): boolean => {
    if (allUsers.some(u => u.email === userData.email)) return false;
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      problemsSolved: 0,
      eventsAttended: 0,
      rank: allUsers.length + 1,
      streak: 0,
      badges: ["New Member"],
      joinedDate: new Date().toISOString().split("T")[0],
      password,
    };
    setAllUsers(prev => [...prev, newUser]);
    const { password: _, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem("gfg_current_user", JSON.stringify(safe));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gfg_current_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("gfg_current_user", JSON.stringify(updated));
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...data } : u));
  };

  return (
    <AuthContext.Provider value={{ user, users: allUsers.map(({ password, ...u }) => u), login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
