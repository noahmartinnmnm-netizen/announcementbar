import {
  BlockStack,
  Modal,
  Text,
} from "@shopify/polaris";

interface DeleteBarModalProps {
  open: boolean;
  title: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteBarModal({
  open,
  title,
  loading = false,
  onClose,
  onConfirm,
}: DeleteBarModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete announcement bar"
      primaryAction={{
        content: "Delete",
        destructive: true,
        loading,
        onAction: onConfirm,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="200">
          <Text as="p" variant="bodyMd">
            Are you sure you want to delete{" "}
            <Text as="span" fontWeight="semibold">
              {title}
            </Text>
            ? This action cannot be undone.
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
