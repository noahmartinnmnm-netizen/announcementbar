import { DISMISS_STORAGE_KEY } from "../types";

type DismissMap = Record<string, string>;

function readMap(): DismissMap {
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as DismissMap;
  } catch {
    return {};
  }
}

function writeMap(map: DismissMap): void {
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage unavailable or quota exceeded — fail silently.
  }
}

export function isDismissed(barId: string, contentHash: string): boolean {
  const map = readMap();
  return map[barId] === contentHash;
}

export function saveDismissed(barId: string, contentHash: string): void {
  const map = readMap();
  map[barId] = contentHash;
  writeMap(map);
}

export function pruneDismissed(validIds: Set<string>): void {
  const map = readMap();
  let changed = false;

  for (const id of Object.keys(map)) {
    if (!validIds.has(id)) {
      delete map[id];
      changed = true;
    }
  }

  if (changed) {
    writeMap(map);
  }
}
