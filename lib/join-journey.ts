import type { RegistrationStatus } from "@/lib/database.types";

export type JourneyStepId = "register" | "review" | "pay" | "confirmed";

export const JOURNEY_STEP_IDS: JourneyStepId[] = [
  "register",
  "review",
  "pay",
  "confirmed",
];

/** Map registration status → which journey panel is primary. */
export function journeyStepFromStatus(
  status: RegistrationStatus | null | undefined,
): JourneyStepId {
  switch (status) {
    case "pending_approval":
      return "review";
    case "approved":
      return "pay";
    case "paid":
      return "confirmed";
    case "cancelled":
    case "draft":
    default:
      return "register";
  }
}

export function journeyStepIndex(id: JourneyStepId): number {
  return JOURNEY_STEP_IDS.indexOf(id);
}

/** Highest step unlocked for this status (0-based). */
export function unlockedStepIndex(
  status: RegistrationStatus | null | undefined,
): number {
  return journeyStepIndex(journeyStepFromStatus(status));
}

export function isJourneyStepComplete(
  stepId: JourneyStepId,
  status: RegistrationStatus | null | undefined,
): boolean {
  const current = unlockedStepIndex(status);
  const idx = journeyStepIndex(stepId);
  if (status === "paid") return true;
  if (status === "cancelled") return false;
  return idx < current;
}
