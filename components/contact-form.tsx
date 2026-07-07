"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function ContactForm() {
  const { dict } = useI18n();
  const f = dict.pages.contact.form;
  const topics = f.topics;

  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: topics[0],
    message: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

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
          {f.thanksTitle}
          {form.name ? `, ${form.name}` : ""}!
        </h3>
        <p className="mt-2 text-sm text-muted">{f.thanksBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-paper-line bg-white p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.name}>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls}
            placeholder={f.namePlaceholder}
          />
        </Field>
        <Field label={f.email}>
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

      <Field label={f.topic} className="mt-4">
        <select
          value={form.topic}
          onChange={(e) => set("topic", e.target.value)}
          className={inputCls}
        >
          {topics.map((t) => (
            <option key={t} value={t} className="bg-white">
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label={f.message} className="mt-4">
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${inputCls} resize-none`}
          placeholder={f.messagePlaceholder}
        />
      </Field>

      <button
        type="submit"
        disabled={busy}
        className="btn-primary mt-6 w-full disabled:opacity-70"
      >
        {busy ? f.sending : f.send}
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
