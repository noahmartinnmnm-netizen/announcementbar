import type { BarFormValues } from "../../types";

interface BarFormHiddenFieldsProps {
  values: BarFormValues;
}

export function BarFormHiddenFields({ values }: BarFormHiddenFieldsProps) {
  return (
    <>
      <input type="hidden" name="name" value={values.name} />
      <input type="hidden" name="title" value={values.title} />
      <input type="hidden" name="message" value={values.message} />
      <input type="hidden" name="subheading" value={values.subheading} />
      <input type="hidden" name="couponCode" value={values.couponCode} />
      <input type="hidden" name="runningTextAlign" value={values.runningTextAlign} />
      <input type="hidden" name="runningSpeed" value={values.runningSpeed} />
      <input type="hidden" name="iconUrl" value={values.iconUrl} />
      <input type="hidden" name="ctaText" value={values.ctaText} />
      <input type="hidden" name="ctaUrl" value={values.ctaUrl} />
      <input type="hidden" name="designPreset" value={values.designPreset} />
      <input type="hidden" name="backgroundColor" value={values.backgroundColor} />
      <input type="hidden" name="textColor" value={values.textColor} />
      <input type="hidden" name="buttonColor" value={values.buttonColor} />
      <input type="hidden" name="buttonTextColor" value={values.buttonTextColor} />
      <input type="hidden" name="fontSize" value={values.fontSize} />
      <input type="hidden" name="height" value={values.height} />
      <input type="hidden" name="padding" value={values.padding} />
      <input type="hidden" name="borderRadius" value={values.borderRadius} />
      <input type="hidden" name="customCss" value={values.customCss} />
      <input type="hidden" name="customHtmlJavascript" value={values.customHtmlJavascript} />
      <input type="hidden" name="rotateNavPlacement" value={values.rotateNavPlacement} />
      <input type="hidden" name="rotateInterval" value={values.rotateInterval} />
      <input type="hidden" name="startDate" value={values.startDate} />
      <input type="hidden" name="endDate" value={values.endDate} />
    </>
  );
}
