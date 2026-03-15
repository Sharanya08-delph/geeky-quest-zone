import React, { useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "ai";
  content: string;
}

const roadmaps: Record<string, string> = {
  graphs: `📋 **4-Week Graph Mastery Roadmap**

**Week 1: Foundations**
- BFS & DFS traversals
- Adjacency list/matrix representation
- Practice: 5 easy graph problems on GFG

**Week 2: Shortest Paths**
- Dijkstra's Algorithm
- Bellman-Ford Algorithm
- Practice: 5 medium problems

**Week 3: Advanced**
- Topological Sort
- Minimum Spanning Tree (Kruskal, Prim)
- Practice: 5 medium-hard problems

**Week 4: Mastery**
- Network Flow
- Strongly Connected Components
- Practice: 5 hard problems + 1 contest`,

  dp: `📋 **4-Week Dynamic Programming Roadmap**

**Week 1: Basics**
- Fibonacci, Climbing Stairs
- 1D DP patterns
- Practice: 5 easy DP problems

**Week 2: 2D DP**
- Grid problems, LCS, LIS
- Knapsack variations
- Practice: 5 medium problems

**Week 3: Advanced Patterns**
- Interval DP, Bitmask DP
- DP on Trees
- Practice: 5 medium-hard problems

**Week 4: Optimization**
- Matrix Chain Multiplication
- Digit DP, Profile DP
- Practice: 5 hard problems`,

  default: `I can help you create a personized roadmap! Try topics like:
- "I want to learn Graphs"
- "Help me with Dynamic Programming"
- "How to prepare for placements?"
- "Explain Binary Search Trees"

I'll generate a structured learning path using GFG resources!`
};

const getAIResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("graph")) return roadmaps.graphs;
  if (lower.includes("dp") || lower.includes("dynamic programming")) return roadmaps.dp;
  if (lower.includes("placement")) return `🎯 **Placement Preparation Guide**\n\n1. **DSA**: Focus on Arrays, Strings, Trees, Graphs, DP\n2. **Aptitude**: Practice quant, logical reasoning, verbal\n3. **CS Fundamentals**: OS, DBMS, CN, OOPs\n4. **Projects**: 2-3 strong projects\n5. **Mock Interviews**: Practice weekly\n\nCheck our Resources tab for curated links!`;
  if (lower.includes("array")) return `📚 **Arrays Guide**\n\n- Two Pointer technique\n- Sliding Window\n- Kadane's Algorithm\n- Prefix Sum\n\nPractice on GFG: geeksforgeeks.org/array-data-structure/`;
  if (lower.includes("tree") || lower.includes("bst")) return `🌳 **Trees Roadmap**\n\n- Binary Tree traversals (Inorder, Preorder, Postorder)\n- BST operations\n- AVL Trees, Red-Black Trees\n- Segment Trees, Fenwick Trees\n\nStart with: geeksforgeeks.org/binary-tree-data-structure/`;
  return roadmaps.default;
};

const MemberAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "👋 Hi! I'm your AI learning assistant. I can help you:\n\n🗺️ **Create personalized roadmaps** for any topic\n💡 **Clear doubts** on DSA concepts\n📚 **Suggest resources** for learning\n\nTry asking: \"I want to learn Graphs\" or \"Help me with DP\"" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const aiMsg: Message = { role: "ai", content: getAIResponse(input) };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center gap-2">
        <Bot size={24} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
        <Sparkles size={16} className="text-primary animate-pulse" />
      </div>

      <div className="flex-1 glass-card p-4 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-xl text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                <User size={16} className="text-foreground" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything about DSA, coding, placements..."
          className="input-field"
        />
        <button onClick={handleSend} className="btn-primary px-4 flex items-center gap-2">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default MemberAI;
