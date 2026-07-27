"use client";

import { Check, Lock } from "lucide-react";
import {
  JOURNEY_STEP_IDS,
  isJourneyStepComplete,
  journeyStepIndex,
  unlockedStepIndex,
  type JourneyStepId,
} from "@/lib/join-journey";
import type { RegistrationStatus } from "@/lib/database.types";
import { useI18n } from "@/components/i18n-provider";
import { t } from "@/lib/i18n/t";

type Props = {
  active: JourneyStepId;
  status: RegistrationStatus | null;
  onSelect: (step: JourneyStepId) => void;
  allowRegisterOverride?: boolean;
};

export function JoinJourneyStepper({
  active,
  status,
  onSelect,
  allowRegisterOverride = false,
}: Props) {
  const { dict } = useI18n();
  const j = dict.pages.join;
  const unlocked = unlockedStepIndex(status);
  const activeIdx = journeyStepIndex(active);

  return (
    <nav aria-label={j.progressAria} className="w-full">
      <ol className="flex w-full items-start">
        {JOURNEY_STEP_IDS.map((stepId, i) => {
          const label = j.steps[stepId];
          const complete = isJourneyStepComplete(stepId, status);
          const isActive = stepId === active;
          const reached = i <= unlocked;
          const canOpen =
            reached ||
            isActive ||
            (allowRegisterOverride && stepId === "register");
          const locked = !canOpen;

          return (
            <li
              key={stepId}
              className="relative flex flex-1 flex-col items-center"
            >
              {i < JOURNEY_STEP_IDS.length - 1 ? (
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-[calc(50%+1rem)] right-[calc(-50%+1rem)] top-4 h-0.5 -translate-y-1/2 sm:top-[1.125rem] ${
                    i < unlocked || (status === "paid" && i < 3)
                      ? "bg-brand-orange"
                      : "bg-paper-line"
                  }`}
                />
              ) : null}

              <button
                type="button"
                disabled={locked}
                onClick={() => canOpen && onSelect(stepId)}
                aria-current={isActive ? "step" : undefined}
                className={`relative z-[1] flex flex-col items-center gap-2 disabled:cursor-not-allowed ${
                  canOpen ? "cursor-pointer" : ""
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-9 sm:w-9 ${
                    isActive
                      ? "bg-brand-orange text-white shadow-[0_8px_20px_-10px_rgba(234,85,4,0.8)] ring-2 ring-brand-orange/30 ring-offset-2 ring-offset-paper-cream"
                      : complete
                        ? "bg-brand-orange text-white"
                        : locked
                          ? "border border-paper-line bg-white text-muted"
                          : "border border-paper-line bg-white text-brand-ink"
                  }`}
                >
                  {complete && !isActive ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : locked ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    String(i + 1)
                  )}
                </span>
                <span
                  className={`hidden max-w-[4.5rem] text-center text-[11px] font-semibold leading-tight sm:block ${
                    isActive
                      ? "text-brand-orange"
                      : complete || i === activeIdx
                        ? "text-brand-ink"
                        : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-xs font-medium text-muted sm:hidden">
        {t(j.stepMobile, {
          n: activeIdx + 1,
          label: j.steps[active],
        })}
      </p>
    </nav>
  );
}
