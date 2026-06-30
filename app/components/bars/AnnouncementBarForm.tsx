import {
  BlockStack,
  Box,
  Button,
  InlineStack,
  Tabs,
  Text,
} from "@shopify/polaris";
import { SaveBar } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, useBlocker, type BlockerFunction } from "react-router";
import type { BarFormErrors, BarFormValues, DesignPresetId } from "../../types";
import { formValuesToBarInput } from "../../utils/bar";
import { getDesignPreset } from "../../utils/design-presets";
import { areFormValuesEqual } from "../../utils/form-values";
import { BarFormErrorBanner } from "./BarFormErrorBanner";
import { BarFormHiddenFields } from "./BarFormHiddenFields";
import { BarPreview } from "./BarPreview";
import { BarPublishBadge } from "./BarPublishBadge";
import { ContentTabPanel } from "./ContentTabPanel";
import { DesignTabPanel } from "./DesignTabPanel";
import { PlacementTabPanel } from "./PlacementTabPanel";

interface AnnouncementBarFormProps {
  initialValues: BarFormValues;
  errors: BarFormErrors;
  barId?: string;
}

const EDITOR_TABS = [
  { id: "content", content: "Content" },
  { id: "design", content: "Design" },
  { id: "placement", content: "Placement" },
];

const FORM_ID = "announcement-bar-form";

export function AnnouncementBarForm({
  initialValues,
  errors,
  barId,
}: AnnouncementBarFormProps) {
  const [values, setValues] = useState(initialValues);
  const [selectedTab, setSelectedTab] = useState(0);
  const intentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const previewBar = useMemo(() => formValuesToBarInput(values), [values]);
  const isDirty = useMemo(
    () => !areFormValuesEqual(values, initialValues),
    [values, initialValues],
  );

  const showPublishButton = !values.enabled && !isDirty;

  const shouldBlockNavigation = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
    [isDirty],
  );

  useBlocker(shouldBlockNavigation);

  const submitForm = useCallback((intent: "save" | "publish") => {
    if (intentRef.current) {
      intentRef.current.value = intent;
    }
    const form = document.getElementById(FORM_ID) as HTMLFormElement | null;
    form?.requestSubmit();
  }, []);

  const handleSave = useCallback(() => {
    submitForm("save");
  }, [submitForm]);

  const handleDiscard = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const applyDesignPreset = useCallback((presetId: DesignPresetId) => {
    const preset = getDesignPreset(presetId);
    setValues((current) => ({
      ...current,
      designPreset: preset.id,
      ...(preset.id !== "custom"
        ? {
            backgroundColor: preset.colors.backgroundColor,
            textColor: preset.colors.textColor,
            buttonColor: preset.colors.buttonColor,
            buttonTextColor: preset.colors.buttonTextColor,
          }
        : {}),
    }));
  }, []);

  const updateField = useCallback(
    <K extends keyof BarFormValues>(key: K, value: BarFormValues[K]) => {
      setValues((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const displayName = values.name.trim() || "Announcement name";

  return (
    <>
      <SaveBar id="announcement-bar-save-bar" open={isDirty} discardConfirmation>
        <button type="button" variant="primary" onClick={handleSave} />
        <button type="button" onClick={handleDiscard} />
      </SaveBar>

      <Form method="post" id={FORM_ID}>
        {barId ? <input type="hidden" name="barId" value={barId} /> : null}
        <input ref={intentRef} type="hidden" name="intent" defaultValue="save" />
        <input type="hidden" name="displayLocation" value={values.displayLocation} />
        <input type="hidden" name="announcementType" value={values.announcementType} />
        <input type="hidden" name="ctaType" value={values.ctaType} />
        <input type="hidden" name="position" value={values.position} />
        <input type="hidden" name="scheduleStartMode" value={values.scheduleStartMode} />
        <input type="hidden" name="scheduleEndMode" value={values.scheduleEndMode} />
        <input type="hidden" name="sticky" value={values.sticky ? "true" : "false"} />
        <input
          type="hidden"
          name="dismissible"
          value={values.dismissible ? "true" : "false"}
        />
        <input
          type="hidden"
          name="pauseOnHover"
          value={values.pauseOnHover ? "true" : "false"}
        />
        <input type="hidden" name="enabled" value={values.enabled ? "true" : "false"} />
        <input type="hidden" name="deviceDesktop" value={values.devices.desktop ? "true" : "false"} />
        <input type="hidden" name="deviceMobile" value={values.devices.mobile ? "true" : "false"} />
        <input type="hidden" name="deviceTablet" value={values.devices.tablet ? "true" : "false"} />
        <input type="hidden" name="pageAll" value={values.pages.all ? "true" : "false"} />
        <input type="hidden" name="pageHome" value={values.pages.home ? "true" : "false"} />
        <input type="hidden" name="pageProduct" value={values.pages.product ? "true" : "false"} />
        <input type="hidden" name="pageCollection" value={values.pages.collection ? "true" : "false"} />
        <input type="hidden" name="pageCart" value={values.pages.cart ? "true" : "false"} />
        <input type="hidden" name="pageSearch" value={values.pages.search ? "true" : "false"} />
        <input type="hidden" name="pageBlog" value={values.pages.blog ? "true" : "false"} />
        <input type="hidden" name="messagesJson" value={JSON.stringify(values.messages)} />
        <BarFormHiddenFields values={values} />

        <BlockStack gap="500">
          <BarFormErrorBanner errors={errors} />
          <InlineStack align="space-between" blockAlign="center" wrap={false}>
            <InlineStack gap="300" blockAlign="center">
              <Text as="h1" variant="headingLg">
                {displayName}
              </Text>
              <BarPublishBadge enabled={values.enabled} />
            </InlineStack>
            {showPublishButton ? (
              <Button
                submit
                variant="primary"
                onClick={() => submitForm("publish")}
              >
                Publish
              </Button>
            ) : !values.enabled && isDirty ? (
              <Text as="span" variant="bodySm" tone="subdued">
                Save changes before publishing
              </Text>
            ) : values.enabled && !isDirty ? (
              <Text as="span" variant="bodySm" tone="subdued">
                Published — no unsaved changes
              </Text>
            ) : null}
          </InlineStack>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(380px, 460px) minmax(0, 1fr)",
              gap: "24px",
              alignItems: "start",
            }}
          >
            <BlockStack gap="400">
              <Tabs tabs={EDITOR_TABS} selected={selectedTab} onSelect={setSelectedTab} />
              <Box>
                {selectedTab === 0 ? (
                  <ContentTabPanel values={values} errors={errors} updateField={updateField} />
                ) : null}
                {selectedTab === 1 ? (
                  <DesignTabPanel
                    values={values}
                    errors={errors}
                    updateField={updateField}
                    applyDesignPreset={applyDesignPreset}
                  />
                ) : null}
                {selectedTab === 2 ? (
                  <PlacementTabPanel values={values} updateField={updateField} />
                ) : null}
              </Box>
            </BlockStack>

            <div style={{ position: "sticky", top: 16 }}>
              <BarPreview bar={previewBar} />
            </div>
          </div>
        </BlockStack>
      </Form>
    </>
  );
}
