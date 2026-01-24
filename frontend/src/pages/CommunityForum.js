import React, { useState, useEffect } from 'react';
import nlp from 'compromise';
import { MessageSquare, ShieldCheck, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

// Pre-defined harmful keywords for moderation demo
const HARMFUL_TERMS = ['bleach', 'acid', 'burn', 'homemade', 'steroid'];

export default function CommunityForum() {
  const [posts, setPosts] = useState([
    { id: 1, author: "Anya", content: "Switching to gel cleansers changed my life in this humidity!", skinType: "Oily", status: "Safe" }
  ]);
  const [newPost, setNewPost] = useState("");
  const [warning, setWarning] = useState("");

  const handlePostSubmit = (e) => {
    e.preventDefault();
    setWarning("");

    // --- AI MODERATION LOGIC (compromise.js) ---
    // We normalize the text to catch variations
    let doc = nlp(newPost.toLowerCase());
    let foundHarmful = HARMFUL_TERMS.some(term => doc.has(term));

    if (foundHarmful) {
      setWarning("Our AI detects potentially harmful skin advice. Please consult a dermatologist.");
      return;
    }

    // If safe, add to local state (In production, this sends to Backend)
    const postObj = {
      id: posts.length + 1,
      author: "You",
      content: newPost,
      skinType: "Combination",
      status: "Verified Safe"
    };

    setPosts([postObj, ...posts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-24 px-6 font-sans">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Insights Dashboard (VentureCube Value) */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <TrendingUp className="text-pink-400 mb-4" />
            <h3 className="font-serif-aesthetic italic text-xl mb-4">Community Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Oily Skin Trend</p>
                <p className="text-sm text-slate-700 font-medium">80% of users prefer Tea Tree in humidity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-pink-50">
            <h2 className="text-3xl font-serif-aesthetic italic mb-6">Skin Journeys</h2>
            
            <form onSubmit={handlePostSubmit} className="space-y-4 mb-10">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your progress or ask for advice..."
                className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none text-sm"
                rows="3"
              />
              {warning && (
                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  <AlertCircle size={14}/> {warning}
                </div>
              )}
              <button className="w-full bg-slate-900 text-white py-4 rounded-full font-sans-aesthetic text-[10px] font-bold tracking-widest hover:bg-pink-600 transition-all">
                POST TO COMMUNITY
              </button>
            </form>

            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="p-6 rounded-[2rem] border border-slate-50 bg-white hover:shadow-lg transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center text-[10px] font-bold text-pink-400">
                        {post.author[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{post.author}</span>
                    </div>
                    <span className="text-[8px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={10}/> {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{post.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}