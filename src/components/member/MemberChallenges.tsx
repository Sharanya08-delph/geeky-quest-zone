import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Code, Play, CheckCircle, Swords, Send, Coins, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const difficultyColors: Record<string, string> = {
  easy: "text-primary bg-primary/10",
  medium: "text-streak-orange bg-streak-orange/10",
  hard: "text-streak-red bg-streak-red/10",
};

const pointsMap: Record<string, number> = { easy: 5, medium: 15, hard: 30 };

const MemberChallenges = () => {
  const { problems, challenges, submissions, createChallenge, submitSolution, acceptChallenge } = useData();
  const { user, profile, profiles } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [code, setCode] = useState("// Write your solution here\n\nfunction solve(input) {\n  // Your code\n  return result;\n}");
  const [language, setLanguage] = useState("javascript");
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeUser, setChallengeUser] = useState("");
  const [challengeProblem, setChallengeProblem] = useState("");
  const [betAmount, setBetAmount] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const selected = problems.find(p => p.id === selectedProblem);
  const isSolved = (problemId: string) => submissions.some(s => s.problem_id === problemId && s.status === "accepted");

  const handleSubmitSolution = async () => {
    if (!selectedProblem || !code.trim()) return;
    if (isSolved(selectedProblem)) {
      toast.info("You've already solved this problem!");
      return;
    }
    setSubmitting(true);
    const result = await submitSolution(selectedProblem, code, language);
    setSubmitting(false);
    if (result) {
      toast.success(`Solution accepted! +${result.pointsEarned} points 🎉`);
    } else {
      toast.error("Failed to submit or already solved.");
    }
  };

  const handleChallenge = async () => {
    if (!challengeUser || !challengeProblem) return;
    setSubmitting(true);
    const { error } = await createChallenge(challengeUser, challengeProblem, betAmount);
    setSubmitting(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Challenge sent! 🎯");
      setShowChallenge(false);
      setChallengeUser("");
      setChallengeProblem("");
      setBetAmount(10);
    }
  };

  const handleAccept = async (challengeId: string) => {
    await acceptChallenge(challengeId);
    toast.success("Challenge accepted! Good luck! 🔥");
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
          <p className="text-xs text-muted-foreground">Bet points (5-50). Winner takes all! Your balance: <span className="text-primary font-bold">{profile?.points || 0}</span> pts</p>
          <select value={challengeUser} onChange={e => setChallengeUser(e.target.value)} className="input-field">
            <option value="">Select a member...</option>
            {profiles.filter(p => p.user_id !== user?.id).map(p => (
              <option key={p.user_id} value={p.user_id}>{p.name} ({p.department}) - {p.points} pts</option>
            ))}
          </select>
          <select value={challengeProblem} onChange={e => setChallengeProblem(e.target.value)} className="input-field">
            <option value="">Select a problem...</option>
            {problems.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.difficulty}) - {pointsMap[p.difficulty]} pts</option>
            ))}
          </select>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Bet Amount (5-50 points)</label>
            <input type="number" min={5} max={50} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} className="input-field" />
          </div>
          <button onClick={handleChallenge} disabled={submitting} className="btn-primary text-sm py-2 flex items-center gap-2">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} /> Send Challenge ({betAmount} pts)</>}
          </button>
        </motion.div>
      )}

      {/* Active Challenges */}
      {challenges.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Your Challenges</h2>
          {challenges.map(c => (
            <div key={c.id} className="glass-card p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">{c.challenger_name}</span> vs <span className="font-medium">{c.challenged_name}</span>
                </p>
                <p className="text-xs text-muted-foreground">{c.problem_title} • <Coins size={10} className="inline" /> {c.bet_amount} pts each</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === "pending" ? "bg-streak-orange/15 text-streak-orange" : c.status === "accepted" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {c.status}
                </span>
                {c.status === "pending" && c.challenged_id === user?.id && (
                  <button onClick={() => handleAccept(c.id)} className="btn-primary text-xs py-1 px-3">Accept</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Problem List */}
        <div className="lg:w-1/3 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Problems</h2>
          {problems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No problems available yet.</p>
          ) : (
            problems.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProblem(p.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedProblem === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{p.title}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">{pointsMap[p.difficulty]}pts</span>
                    {isSolved(p.id) && <CheckCircle size={14} className="text-primary" />}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
                  <span className="text-xs text-muted-foreground">{p.category}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Problem Detail & Code Editor */}
        <div className="lg:w-2/3 space-y-4">
          {selected ? (
            <>
              <div className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">{selected.title}</h2>
                  <span className="flex items-center gap-1 text-sm font-bold text-primary"><Coins size={14} /> {pointsMap[selected.difficulty]} pts</span>
                </div>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[selected.difficulty]}`}>{selected.difficulty}</span>
                <p className="text-muted-foreground mt-3">{selected.description}</p>
                {Array.isArray(selected.examples) && (selected.examples as any[]).map((ex: any, i: number) => (
                  <div key={i} className="bg-muted rounded-lg p-3 font-mono text-sm mt-2">
                    <p className="text-muted-foreground">Input: <span className="text-foreground">{ex.input}</span></p>
                    <p className="text-muted-foreground">Output: <span className="text-primary">{ex.output}</span></p>
                  </div>
                ))}
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
                  <button onClick={handleSubmitSolution} disabled={submitting || isSolved(selected.id)} className="btn-primary text-sm py-2 flex items-center gap-2">
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : isSolved(selected.id) ? <><CheckCircle size={14} /> Solved</> : <><Play size={14} /> Submit Solution (+{pointsMap[selected.difficulty]} pts)</>}
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
    </div>
  );
};

export default MemberChallenges;
