import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  year: string | null;
  register_number: string | null;
  points: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  profiles: Profile[];
  session: any | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (userData: { name: string; email: string; phone: string; department: string; year: string; registerNumber: string }, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};

// Mock data for demonstration
const mockProfiles: Profile[] = [
  {
    id: "1",
    user_id: "1",
    name: "Admin User",
    email: "ritadmin@gmail.com",
    phone: "1234567890",
    department: "Computer Science",
    year: "4th",
    register_number: "CS2021001",
    points: 100,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "2",
    name: "Student User",
    email: "student.ritchennai.edu.in",
    phone: "0987654321",
    department: "Information Technology",
    year: "2nd",
    register_number: "IT2022001",
    points: 50,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const foundProfile = mockProfiles.find(p => p.user_id === userId);
    if (foundProfile) {
      setProfile(foundProfile);
      return foundProfile;
    }
    return null;
  };

  const checkAdmin = (userId: string) => {
    // Mock admin check - first user is admin
    setIsAdmin(userId === "1");
  };

  const refreshProfiles = async () => {
    setProfiles(mockProfiles);
  };

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem("user");
    const savedProfile = localStorage.getItem("profile");
    
    if (savedUser && savedProfile) {
      const user = JSON.parse(savedUser);
      const profile = JSON.parse(savedProfile);
      setUser(user);
      setProfile(profile);
      setSession({ user });
      checkAdmin(user.id);
      setProfiles(mockProfiles);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    if (email === "ritadmin@gmail.com" && password === "rit123") {
      const user = { id: "1", email };
      const userProfile = mockProfiles.find(p => p.user_id === "1");
      setUser(user);
      setProfile(userProfile || null);
      setSession({ user });
      setIsAdmin(true);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("profile", JSON.stringify(userProfile));
      return { error: null };
    } else {
      // Check if email contains ritchennai.edu.in for member login
      if (!email.includes("ritchennai.edu.in")) {
        return { error: "please use clg mail id only" };
      }
      
      // Find user in mock profiles or create new one for first-time users
      let userProfile = mockProfiles.find(p => p.email === email);
      
      if (!userProfile) {
        // First-time user - return error to ask them to register first
        return { error: "First-time user? Please register your account first" };
      }
      
      // For existing users, accept any password (in real implementation, verify against stored password)
      const user = { id: userProfile.user_id, email };
      setUser(user);
      setProfile(userProfile);
      setSession({ user });
      setIsAdmin(false);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("profile", JSON.stringify(userProfile));
      return { error: null };
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; department: string; year: string; registerNumber: string }, password: string) => {
    // Mock registration - validate email domain
    if (!userData.email.includes("ritchennai.edu.in")) {
      return { error: "please use clg mail id only" };
    }
    
    // Check if user already exists
    const existingUser = mockProfiles.find(p => p.email === userData.email);
    if (existingUser) {
      return { error: "An account with this email already exists" };
    }
    
    const newProfile: Profile = {
      id: Date.now().toString(),
      user_id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      department: userData.department,
      year: userData.year,
      register_number: userData.registerNumber,
      points: 0,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProfiles.push(newProfile);
    setProfiles([...mockProfiles]);
    return { error: null };
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAdmin(false);
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...data, updated_at: new Date().toISOString() };
    setProfile(updatedProfile);
    
    // Update in mock data
    const index = mockProfiles.findIndex(p => p.id === profile.id);
    if (index !== -1) {
      mockProfiles[index] = updatedProfile;
      setProfiles([...mockProfiles]);
    }
    
    localStorage.setItem("profile", JSON.stringify(updatedProfile));
  };

  return (
    <AuthContext.Provider value={{ user, profile, profiles, session, isAdmin, loading, login, register, logout, updateProfile, refreshProfiles }}>
      {children}
    </AuthContext.Provider>
  );
};
