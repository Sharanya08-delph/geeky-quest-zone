import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { ExternalLink, BookOpen, Code, BrainCircuit } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  tutorial: <BookOpen size={16} />,
  dsa: <Code size={16} />,
  aptitude: <BrainCircuit size={16} />,
  link: <ExternalLink size={16} />,
};

const MemberResources = () => {
  const { resources } = useData();
  const [filter, setFilter] = useState("all");

  const categories = ["all", "tutorial", "dsa", "aptitude"];
  const filtered = filter === "all" ? resources : resources.filter(r => r.category === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Learning Resources</h1>
      <div className="flex gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`tab-item ${filter === cat ? "active" : ""}`}>
            {cat === "all" ? "All" : cat === "dsa" ? "DSA Practice" : cat === "aptitude" ? "Aptitude" : "Tutorials"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="glass-card-hover p-5 block group">
            <div className="flex items-center gap-2 text-primary mb-2">
              {categoryIcons[r.category]}
              <span className="text-xs font-medium uppercase">{r.category}</span>
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{r.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{r.description}</p>
            <div className="flex items-center gap-1 text-xs text-primary mt-3">
              <ExternalLink size={12} /> Open Resource
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MemberResources;
