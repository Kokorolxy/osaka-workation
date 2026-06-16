"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const TOPICS = ["Join the Workation", "Stays", "Partnership", "Press", "Other"];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: TOPICS[0],
    message: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          topic: form.topic,
          message: form.message,
          source: `Contact · ${form.topic}`,
        }),
      });
    } catch {
      // ignore — still thank the user
    }
    setBusy(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-brand-orange/40 bg-brand-orange/10 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/20">
          <Check className="h-6 w-6 text-brand-orange" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-brand-ink">
          Thanks, {form.name || "friend"}!
        </h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve got your message and will reply within a couple of days.
          See you in Osaka soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-paper-line bg-white p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls}
            placeholder="you@email.com"
          />
        </Field>
      </div>

      <Field label="What's this about?" className="mt-4">
        <select
          value={form.topic}
          onChange={(e) => set("topic", e.target.value)}
          className={inputCls}
        >
          {TOPICS.map((t) => (
            <option key={t} value={t} className="bg-white">
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" className="mt-4">
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${inputCls} resize-none`}
          placeholder="Tell us a little about you and what you're after…"
        />
      </Field>

      <button
        type="submit"
        disabled={busy}
        className="btn-primary mt-6 w-full disabled:opacity-70"
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-paper-line bg-paper-cream px-4 py-3 text-sm text-brand-ink placeholder:text-muted-soft focus:border-brand-orange focus:bg-white focus:outline-none";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
