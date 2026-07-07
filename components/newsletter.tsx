"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const { dict } = useI18n();
  const n = dict.ui.newsletter;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || busy) return;
    setBusy(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Newsletter waitlist" }),
      });
    } catch {
      // ignore — still thank the user
    }
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <div
        className={`flex items-center gap-3 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-5 py-3 text-sm font-medium text-brand-ink ${
          compact ? "" : "justify-center"
        }`}
      >
        <Check className="h-4 w-4 text-brand-orange" />
        {n.thanks}
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
        placeholder={n.placeholder}
        className="w-full flex-1 rounded-full border border-paper-line bg-white px-5 py-3 text-sm text-brand-ink placeholder:text-muted-soft focus:border-brand-orange focus:outline-none"
      />
      <button
        type="submit"
        disabled={busy}
        className="btn-primary whitespace-nowrap disabled:opacity-70"
      >
        {busy ? n.joining : n.join}
      </button>
    </form>
  );
}
