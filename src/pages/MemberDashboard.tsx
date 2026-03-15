import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gfgLogo from "@/assets/gfg-logo.svg";
import {
  LayoutGrid, Calendar, BookOpen, Terminal, Trophy, MessagesSquare, Bot,
  Bell, Search, LogOut, User, ChevronDown, Menu, X
} from "lucide-react";
import MemberHome from "@/components/member/MemberHome";
import MemberEvents from "@/components/member/MemberEvents";
import MemberResources from "@/components/member/MemberResources";
import MemberChallenges from "@/components/member/MemberChallenges";
import MemberLeaderboard from "@/components/member/MemberLeaderboard";
import MemberCommunity from "@/components/member/MemberCommunity";
import MemberAI from "@/components/member/MemberAI";
import MemberProfile from "@/components/member/MemberProfile";

const tabs = [
  { id: "home", label: "Dashboard", icon: LayoutGrid },
  { id: "events", label: "Events", icon: Calendar },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "challenges", label: "Challenges", icon: Terminal },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "community", label: "Community", icon: MessagesSquare },
  { id: "ai", label: "AI Assistant", icon: Bot },
];

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  if (!user) { navigate("/"); return null; }

  const renderContent = () => {
    if (showProfile) return <MemberProfile />;
    switch (activeTab) {
      case "home": return <MemberHome />;
      case "events": return <MemberEvents />;
      case "resources": return <MemberResources />;
      case "challenges": return <MemberChallenges />;
      case "leaderboard": return <MemberLeaderboard />;
      case "community": return <MemberCommunity />;
      case "ai": return <MemberAI />;
      default: return <MemberHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="fixed top-0 left-0 h-full bg-card/95 backdrop-blur-xl border-r border-border z-30 overflow-hidden flex flex-col"
      >
        <div className="p-5 flex items-center gap-3 border-b border-border">
          <img src={gfgLogo} alt="GFG" className="h-8" />
          <div>
            <h2 className="font-bold text-sm gradient-text">GFG-RIT</h2>
            <p className="text-xs text-muted-foreground">Campus Club</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowProfile(false); }}
              className={`sidebar-nav-item w-full text-left ${activeTab === tab.id && !showProfile ? "active" : "text-muted-foreground"}`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={() => { logout(); navigate("/"); }} className="sidebar-nav-item w-full text-left text-muted-foreground hover:text-destructive">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-[240px]" : "ml-0"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search... (Ctrl+K)" className="input-field pl-9 py-2 w-64 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full" />
            </button>

            <div className="relative">
              <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:block text-foreground">{user.name}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-12 glass-card p-2 min-w-[180px] z-50">
                  <button onClick={() => { setShowProfile(true); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent flex items-center gap-2">
                    <User size={14} /> View Profile
                  </button>
                  <button onClick={() => { logout(); navigate("/"); }} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent flex items-center gap-2 text-destructive">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={showProfile ? "profile" : activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;
