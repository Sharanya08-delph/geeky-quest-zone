import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Code, Play, CheckCircle, Swords, Send } from "lucide-react";

const difficultyColors: Record<string, string> = {
  easy: "text-primary bg-primary/10",
  medium: "text-streak-orange bg-streak-orange/10",
  hard: "text-streak-red bg-streak-red/10",
};

const MemberChallenges = () => {
  const { problems, challenges, addChallenge } = useData();
  const { user, users } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [code, setCode] = useState("// Write your solution here\n\nfunction solve(input) {\n  // Your code\n  return result;\n}");
  const [language, setLanguage] = useState("javascript");
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeUser, setChallengeUser] = useState("");
  const [challengeProblem, setChallengeProblem] = useState("");

  const selected = problems.find(p => p.id === selectedProblem);

  const handleChallenge = () => {
    if (!user || !challengeUser || !challengeProblem) return;
    const target = users.find(u => u.id === challengeUser);
    const prob = problems.find(p => p.id === challengeProblem);
    if (!target || !prob) return;
    addChallenge({
      challengerId: user.id,
      challengerName: user.name,
      challengedId: target.id,
      challengedName: target.name,
      problemId: prob.id,
      problemTitle: prob.title,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    });
    setShowChallenge(false);
    setChallengeUser("");
    setChallengeProblem("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Coding Challenges</h1>
        <button onClick={() => setShowChallenge(!showChallenge)} className="btn-primary text-sm py-2 flex items-center gap-2">
          <Swords size={16} /> Peer Challenge
        </button>
      </div>

      {/* Peer Challenge Modal */}
      {showChallenge && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card p-5 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Swords size={18} className="text-primary" /> Challenge a Peer</h3>
          <select value={challengeUser} onChange={e => setChallengeUser(e.target.value)} className="input-field">
            <option value="">Select a member...</option>
            {users.filter(u => u.id !== user?.id && u.role === "member").map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
            ))}
          </select>
          <select value={challengeProblem} onChange={e => setChallengeProblem(e.target.value)} className="input-field">
            <option value="">Select a problem...</option>
            {problems.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
            ))}
          </select>
          <button onClick={handleChallenge} className="btn-primary text-sm py-2 flex items-center gap-2">
            <Send size={14} /> Send Challenge
          </button>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Problem List */}
        <div className="lg:w-1/3 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Problems</h2>
          {problems.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProblem(p.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${selectedProblem === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{p.title}</span>
                {p.solvedBy.includes(user?.id || "") && <CheckCircle size={14} className="text-primary" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Problem Detail & Code Editor */}
        <div className="lg:w-2/3 space-y-4">
          {selected ? (
            <>
              <div className="glass-card p-5">
                <h2 className="text-xl font-bold text-foreground">{selected.title}</h2>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[selected.difficulty]}`}>{selected.difficulty}</span>
                <p className="text-muted-foreground mt-3">{selected.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Examples:</p>
                  {selected.examples.map((ex, i) => (
                    <div key={i} className="bg-muted rounded-lg p-3 font-mono text-sm">
                      <p className="text-muted-foreground">Input: <span className="text-foreground">{ex.input}</span></p>
                      <p className="text-muted-foreground">Output: <span className="text-primary">{ex.output}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Code Editor</span>
                  </div>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="input-field w-auto text-sm py-1 px-3">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full h-64 bg-background font-mono text-sm p-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground"
                  spellCheck={false}
                />
                <div className="flex gap-3 mt-3">
                  <button className="btn-primary text-sm py-2 flex items-center gap-2">
                    <Play size={14} /> Run Code
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
                    Submit Solution
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card p-12 text-center">
              <Code size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a problem to start coding</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Contest */}
      <div className="glass-card p-6 border-l-4 border-primary">
        <h2 className="text-lg font-semibold text-foreground">🏆 Weekly Coding Contest #13</h2>
        <p className="text-sm text-muted-foreground mt-1">Next contest: Saturday, March 22 at 7:00 PM</p>
        <p className="text-sm text-muted-foreground">4 problems • 2 hours • All difficulty levels</p>
        <button className="btn-primary text-sm py-2 mt-3">Register for Contest</button>
      </div>
    </div>
  );
};

export default MemberChallenges;
