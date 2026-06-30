import {
  createBar,
  updateBar,
} from "../services/bars.service";
import type { AdminGraphQLClient, BarFormErrors, BarFormValues } from "../types";
import {
  formValuesToBarInput,
  parseBarFromFormData,
} from "./bar";
import { hasFormErrors, validateBarForm } from "./validation";

interface BarFormFailure {
  ok: false;
  values: BarFormValues;
  errors: BarFormErrors;
}

interface BarFormSuccess {
  ok: true;
  barId: string;
  published: boolean;
}

export type BarFormResult = BarFormFailure | BarFormSuccess;

export async function processBarFormSubmission(
  request: Request,
  admin: AdminGraphQLClient,
  barId?: string,
): Promise<BarFormResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "save");
  const values = parseBarFromFormData(formData);

  if (intent === "publish") {
    values.enabled = true;
  }

  const errors = validateBarForm(values);

  if (hasFormErrors(errors)) {
    return { ok: false, values, errors };
  }

  const input = formValuesToBarInput(values);

  if (barId) {
    await updateBar(admin, barId, input);
    return { ok: true, barId, published: input.enabled };
  }

  const bar = await createBar(admin, input);
  return { ok: true, barId: bar.id, published: input.enabled };
}
