import type { BarFormValues } from "../types";

export function areFormValuesEqual(a: BarFormValues, b: BarFormValues): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
