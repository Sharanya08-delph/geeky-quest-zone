import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gfgLogo from "@/assets/gfg-logo.svg";
import {
  LayoutGrid, Calendar, Users, BookOpen, Megaphone, Trophy, BarChart3,
  FileText, LogOut, Menu, X, Bell, Loader2, Sun, Moon
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import AdminHome from "@/components/admin/AdminHome";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminMembers from "@/components/admin/AdminMembers";
import AdminResources from "@/components/admin/AdminResources";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminLeaderboard from "@/components/admin/AdminLeaderboard";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminContent from "@/components/admin/AdminContent";

const tabs = [
  { id: "home", label: "Dashboard", icon: LayoutGrid },
  { id: "events", label: "Event Mgmt", icon: Calendar },
  { id: "members", label: "Members", icon: Users },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "content", label: "Content", icon: FileText },
];

const AdminDashboard = () => {
  const { user, profile, isAdmin, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate("/");
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <AdminHome />;
      case "events": return <AdminEvents />;
      case "members": return <AdminMembers />;
      case "resources": return <AdminResources />;
      case "announcements": return <AdminAnnouncements />;
      case "leaderboard": return <AdminLeaderboard />;
      case "analytics": return <AdminAnalytics />;
      case "content": return <AdminContent />;
      default: return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="fixed top-0 left-0 h-full bg-card/95 backdrop-blur-xl border-r border-border z-30 overflow-hidden flex flex-col"
      >
        <div className="p-5 flex items-center gap-3 border-b border-border">
          <img src={gfgLogo} alt="GFG" className="h-8" />
          <div>
            <h2 className="font-bold text-sm gradient-text">GFG-RIT</h2>
            <p className="text-xs text-streak-orange font-medium">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sidebar-nav-item w-full text-left ${activeTab === tab.id ? "active" : "text-muted-foreground"}`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={async () => { await logout(); navigate("/"); }} className="sidebar-nav-item w-full text-left text-muted-foreground hover:text-destructive">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-[240px]" : "ml-0"}`}>
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="font-semibold text-foreground">Admin Control Center</h1>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-muted-foreground" />
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {profile?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
