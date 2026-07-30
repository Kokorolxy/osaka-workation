"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type Props = {
  locale: string;
  auth: Dictionary["pages"]["auth"];
  action: (formData: FormData) => void | Promise<void>;
};

const PASSWORD_PATTERN = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$";

export function AuthSignupForm({ locale, auth, action }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const confirmRef = useRef<HTMLInputElement | null>(null);

  function syncConfirmValidity() {
    const confirm = confirmRef.current;
    if (!confirm) return;
    if (confirm.value && confirm.value !== password) {
      confirm.setCustomValidity(auth.passwordMismatch);
    } else {
      confirm.setCustomValidity("");
    }
  }

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="locale" value={locale} />

      <label className="block text-sm font-medium text-brand-ink">
        {auth.displayName}
        <input
          type="text"
          name="display_name"
          autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium text-brand-ink">
        {auth.email}
        <input
          type="email"
          name="email"
          required
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title={auth.emailInvalid}
          autoComplete="email"
          className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium text-brand-ink">
        {auth.password}
        <div className="relative mt-1.5">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={8}
            pattern={PASSWORD_PATTERN}
            title={auth.passwordRules}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              syncConfirmValidity();
            }}
            className="w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 pr-11 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-ink"
            aria-label={auth.togglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </label>

      <label className="block text-sm font-medium text-brand-ink">
        {auth.confirmPassword}
        <div className="relative mt-1.5">
          <input
            ref={confirmRef}
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            required
            minLength={8}
            pattern={PASSWORD_PATTERN}
            title={auth.passwordRules}
            autoComplete="new-password"
            onInput={syncConfirmValidity}
            className="w-full rounded-xl border border-paper-line bg-paper-cream/50 px-4 py-3 pr-11 text-brand-ink outline-none ring-brand-orange transition focus:ring-2"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-ink"
            aria-label={auth.togglePassword}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </label>

      <p className="text-xs text-muted">{auth.passwordRules}</p>

      <button type="submit" className="btn-primary w-full">
        {auth.signUp}
      </button>
    </form>
  );
}
