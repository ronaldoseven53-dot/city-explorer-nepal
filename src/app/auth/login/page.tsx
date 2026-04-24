"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏔️</div>
          <h1 className="text-2xl font-extrabold text-white">My Passport</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to save your favourite destinations</p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-3xl mb-3">📬</p>
            <p className="text-white font-semibold">Check your email!</p>
            <p className="text-white/50 text-sm mt-2">We sent a magic link to <strong className="text-white">{email}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 px-4 py-3 rounded-xl text-sm outline-none focus:border-red-500/60 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending…" : "Send Magic Link ✨"}
            </button>
          </form>
        )}

        <p className="text-center text-white/30 text-xs mt-6">
          No password needed · Secure email link
        </p>
      </div>
    </div>
  );
}
