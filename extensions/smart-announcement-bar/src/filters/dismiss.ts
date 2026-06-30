import type { AnnouncementBar } from "../types";
import { getBarContentHash } from "../utils/messages";
import { isDismissed } from "../utils/storage";

export function isBarDismissed(bar: AnnouncementBar): boolean {
  return isDismissed(bar.id, getBarContentHash(bar));
}
