"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { L } from "@/components/locale-link";
import { getPricing } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

const DISMISS_KEY = "owx_popup_dismiss";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const COPY = {
  en: {
    eyebrow: "Early bird · November 2026",
    title: "Ride the wave — 10% off your Osaka Workation pass",
    body: "Two weeks in Osaka with a ready-made international crew. Early-bird and friend-referral pricing both save 10% — for a limited time.",
    twoweek: "2-Week Workation",
    oneweek: "1-Week Workation",
    cta: "See pricing & join",
    dismiss: "Don't show this again today",
  },
  ja: {
    eyebrow: "早割 · 2026年11月",
    title: "波に乗ろう — 大阪ワーケーションが10%オフ",
    body: "国際的な仲間と過ごす、大阪の2週間。早割・お友達紹介はいずれも10%オフ（期間限定）。",
    twoweek: "2週間ワーケーション",
    oneweek: "1週間ワーケーション",
    cta: "料金を見る・参加する",
    dismiss: "今日はもう表示しない",
  },
};

export function EntryPopup() {
  const { locale } = useI18n();
  const c = locale === "ja" ? COPY.ja : COPY.en;
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pricing = getPricing(locale);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const supabase = createClient();
    let mounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setSignedIn(!!data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let dismissed = "";
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) ?? "";
    } catch {
      dismissed = "";
    }
    if (dismissed !== todayKey()) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const dismissToday = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, todayKey());
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const two = pricing[0];
  const one = pricing[1];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={c.title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="animate-fade-up relative w-full max-w-lg overflow-hidden rounded-3xl border border-paper-line bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-ink/5 text-brand-ink/70 transition-colors hover:bg-brand-ink/10 hover:text-brand-ink"
        >
          <X className="h-4 w-4" />
        </button>

        {/* header band */}
        <div className="bg-brand-orange px-7 py-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">
            {c.eyebrow}
          </p>
          <h2 className="mt-2 max-w-sm text-2xl font-extrabold leading-tight">
            {c.title} <span aria-hidden>🌊</span>
          </h2>
        </div>

        <div className="px-7 py-6">
          <p className="text-sm leading-relaxed text-muted">{c.body}</p>

          {/* price rows */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-brand-orange/30 bg-brand-orange/5 px-4 py-3">
              <span className="text-sm font-semibold text-brand-ink">{c.twoweek}</span>
              <span className="flex items-end gap-2">
                <span className="text-xl font-extrabold tracking-tight text-brand-ink">
                  {two.earlyBird}
                </span>
                <span className="pb-0.5 text-xs text-muted line-through">{two.price}</span>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-paper-line px-4 py-3">
              <span className="text-sm font-semibold text-brand-ink">{c.oneweek}</span>
              <span className="flex items-end gap-2">
                <span className="text-xl font-extrabold tracking-tight text-brand-ink">
                  {one.earlyBird}
                </span>
                <span className="pb-0.5 text-xs text-muted line-through">{one.price}</span>
              </span>
            </div>
          </div>

          <L
            href={signedIn ? "/join" : "/events#pricing"}
            onClick={() => setOpen(false)}
            className="btn-primary mt-6 w-full justify-center"
          >
            {c.cta} <ArrowRight className="h-4 w-4" />
          </L>

          <button
            type="button"
            onClick={dismissToday}
            className="mt-4 block w-full text-center text-xs text-muted-soft underline-offset-2 hover:text-muted hover:underline"
          >
            {c.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
