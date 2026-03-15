import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, ThumbsUp, Send } from "lucide-react";

const MemberCommunity = () => {
  const { forumPosts, addForumPost, addReply } = useData();
  const { user } = useAuth();
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [showNewPost, setShowNewPost] = useState(false);

  const handlePost = () => {
    if (!user || !newTitle.trim() || !newContent.trim()) return;
    addForumPost({ authorId: user.id, authorName: user.name, title: newTitle, content: newContent, date: new Date().toISOString().split("T")[0], replies: [], likes: 0 });
    setNewTitle("");
    setNewContent("");
    setShowNewPost(false);
  };

  const handleReply = (postId: string) => {
    if (!user || !replyContent[postId]?.trim()) return;
    addReply(postId, { authorId: user.id, authorName: user.name, content: replyContent[postId], date: new Date().toISOString().split("T")[0] });
    setReplyContent(prev => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><MessageSquare size={24} className="text-primary" /> Discussion Forum</h1>
        <button onClick={() => setShowNewPost(!showNewPost)} className="btn-primary text-sm py-2">New Post</button>
      </div>

      {showNewPost && (
        <div className="glass-card p-5 space-y-3">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title..." className="input-field" />
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="What's on your mind?" className="input-field h-24 resize-none" />
          <button onClick={handlePost} className="btn-primary text-sm py-2">Post</button>
        </div>
      )}

      <div className="space-y-4">
        {forumPosts.map(post => (
          <div key={post.id} className="glass-card-hover p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{post.authorName.charAt(0)}</div>
                  <div>
                    <span className="font-medium text-foreground text-sm">{post.authorName}</span>
                    <span className="text-xs text-muted-foreground ml-2">{post.date}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mt-2">{post.title}</h3>
              </div>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><ThumbsUp size={14} /> {post.likes}</span>
            </div>
            <p className="text-sm text-muted-foreground">{post.content}</p>

            {post.replies.length > 0 && (
              <div className="ml-6 space-y-2 border-l-2 border-border pl-4">
                {post.replies.map((reply, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium text-foreground">{reply.authorName}</span>
                    <span className="text-muted-foreground ml-2">{reply.content}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={replyContent[post.id] || ""}
                onChange={e => setReplyContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Write a reply..."
                className="input-field text-sm py-2"
                onKeyDown={e => e.key === "Enter" && handleReply(post.id)}
              />
              <button onClick={() => handleReply(post.id)} className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberCommunity;
