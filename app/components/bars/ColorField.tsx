import {
  BlockStack,
  ColorPicker,
  Popover,
  TextField,
} from "@shopify/polaris";
import { hexToRgb, hsbToHex, rgbToHsb } from "@shopify/polaris";
import { useCallback, useId, useMemo, useState } from "react";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

function normalizeHex(value: string): string {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return `#${trimmed}`;
  }
  return "#000000";
}

function hexToHsbColor(hex: string) {
  const rgb = hexToRgb(normalizeHex(hex));
  if (!rgb) {
    return { hue: 0, saturation: 0, brightness: 0 };
  }
  return rgbToHsb(rgb);
}

export function ColorField({ label, value, onChange, error, disabled }: ColorFieldProps) {
  const [popoverActive, setPopoverActive] = useState(false);
  const activatorId = useId();
  const swatchColor = normalizeHex(value);
  const pickerColor = useMemo(() => hexToHsbColor(value), [value]);

  const togglePopover = useCallback(() => {
    setPopoverActive((active) => !active);
  }, []);

  const closePopover = useCallback(() => {
    setPopoverActive(false);
  }, []);

  return (
    <BlockStack gap="100">
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        autoComplete="off"
        disabled={disabled}
        connectedLeft={
          <Popover
            active={popoverActive && !disabled}
            activator={
              <button
                id={activatorId}
                type="button"
                onClick={disabled ? undefined : togglePopover}
                disabled={disabled}
                aria-label={`Choose ${label}`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: swatchColor,
                  border: "1px solid var(--p-color-border)",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            }
            onClose={closePopover}
          >
            <div style={{ padding: 16 }}>
              <ColorPicker
                color={pickerColor}
                onChange={(color) => onChange(hsbToHex(color))}
              />
            </div>
          </Popover>
        }
      />
    </BlockStack>
  );
}
