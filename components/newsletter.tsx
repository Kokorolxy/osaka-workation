"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Wire this to your provider (Mailchimp / Notion / Google Form) later.
    setDone(true);
  }

  if (done) {
    return (
      <div
        className={`flex items-center gap-3 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-5 py-3 text-sm font-medium text-brand-cream ${
          compact ? "" : "justify-center"
        }`}
      >
        <Check className="h-4 w-4 text-brand-orange" />
        You&apos;re on the list — we&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-orange focus:outline-none"
      />
      <button type="submit" className="btn-primary whitespace-nowrap">
        Join the waitlist
      </button>
    </form>
  );
}
