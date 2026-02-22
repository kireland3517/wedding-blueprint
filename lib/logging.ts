import type { AxisVector, Blueprint, LogEntry, MajorConflictKey, MinorTensionKey } from "./types";

const LOG_KEY = "wbg_v1_log";

/**
 * Appends a log entry to localStorage. No server call, no ML — data only.
 * Schema: { timestamp, inputAnswers, axisVector, chosenComponentIds,
 *           conflicts, tensions }
 */
export function logGeneration(
  inputAnswers: Partial<AxisVector>,
  blueprint: Blueprint
): void {
  if (typeof window === "undefined") return; // SSR guard

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    inputAnswers,
    axisVector: blueprint.axisVector,
    chosenComponentIds: {
      palette: blueprint.sections.palette.id,
      typography: blueprint.sections.typography.id,
      paper_print: blueprint.sections.paper_print.id,
      florals: blueprint.sections.florals.id,
      signage: blueprint.sections.signage.id,
    },
    conflicts: blueprint.conflicts.major as MajorConflictKey[],
    tensions: blueprint.conflicts.minor as MinorTensionKey[],
  };

  try {
    const existing = localStorage.getItem(LOG_KEY);
    const log: LogEntry[] = existing ? JSON.parse(existing) : [];
    log.push(entry);
    // Keep last 100 entries to avoid unbounded growth
    const trimmed = log.slice(-100);
    localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage may be unavailable (private browsing, storage quota)
    // Fail silently — logging must never block generation
  }
}

/** Returns all stored log entries. */
export function getLog(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
