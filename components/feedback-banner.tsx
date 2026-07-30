import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type FeedbackVariant = "error" | "success" | "info";

const STYLES: Record<
  FeedbackVariant,
  { box: string; Icon: typeof AlertCircle }
> = {
  error: {
    box: "border-red-200/70 bg-[#fdf2f0] text-[#8b3a32]",
    Icon: AlertCircle,
  },
  success: {
    box: "border-brand-orange/15 bg-brand-orange/5 text-brand-ink",
    Icon: CheckCircle2,
  },
  info: {
    box: "border-paper-line bg-paper-sand/70 text-brand-ink",
    Icon: Info,
  },
};

export function FeedbackBanner({
  variant = "info",
  children,
}: {
  variant?: FeedbackVariant;
  children: ReactNode;
}) {
  const style = STYLES[variant];
  const Icon = style.Icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs leading-snug ${style.box}`}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
