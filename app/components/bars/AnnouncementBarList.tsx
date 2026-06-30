import {
  Badge,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  EmptyState,
  IndexTable,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import type { AnnouncementBar } from "../../types";
import { getBarDisplayName, getDisplayLocationLabel } from "../../utils/bar";
import { BarPublishBadge } from "./BarPublishBadge";
import { DeleteBarModal } from "./DeleteBarModal";

interface AnnouncementBarListProps {
  bars: AnnouncementBar[];
}

interface PendingDelete {
  id: string;
  name: string;
}

export function AnnouncementBarList({ bars }: AnnouncementBarListProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const resourceName = {
    singular: "announcement bar",
    plural: "announcement bars",
  };

  const isSubmitting = fetcher.state !== "idle";

  const submitIntent = useCallback(
    (intent: string, barId: string) => {
      fetcher.submit({ intent, barId }, { method: "post" });
    },
    [fetcher],
  );

  const handleDeleteConfirm = () => {
    if (!pendingDelete) {
      return;
    }

    submitIntent("delete", pendingDelete.id);
    setPendingDelete(null);
  };

  if (bars.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="Create your first announcement bar"
          action={{
            content: "Create announcement bar",
            onAction: () => navigate("/app/bars/new"),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Announcement bars help you promote sales, shipping updates, and
            important store messages.
          </p>
        </EmptyState>
      </Card>
    );
  }

  const rowMarkup = bars.map((bar, index) => (
    <IndexTable.Row id={bar.id} key={bar.id} position={index}>
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            {getBarDisplayName(bar)}
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">
            {bar.message}
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <BarPublishBadge enabled={bar.enabled} />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Badge>{getDisplayLocationLabel(bar.displayLocation ?? "global")}</Badge>
          {bar.sticky ? <Badge>Sticky</Badge> : null}
          {bar.dismissible ? <Badge tone="info">Dismissible</Badge> : null}
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button
            onClick={() => navigate(`/app/bars/${bar.id}`)}
          >
            Edit
          </Button>
          <Button
            onClick={() => submitIntent("toggle", bar.id)}
            loading={isSubmitting && fetcher.formData?.get("barId") === bar.id && fetcher.formData?.get("intent") === "toggle"}
          >
            {bar.enabled ? "Disable" : "Enable"}
          </Button>
          <Button
            onClick={() => submitIntent("duplicate", bar.id)}
            loading={isSubmitting && fetcher.formData?.get("barId") === bar.id && fetcher.formData?.get("intent") === "duplicate"}
          >
            Duplicate
          </Button>
          <Button
            tone="critical"
            onClick={() =>
              setPendingDelete({ id: bar.id, name: getBarDisplayName(bar) })
            }
          >
            Delete
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <Card padding="0">
        <IndexTable
          resourceName={resourceName}
          itemCount={bars.length}
          headings={[
            { title: "Announcement" },
            { title: "Status" },
            { title: "Behavior" },
            { title: "Actions" },
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </Card>

      <DeleteBarModal
        open={Boolean(pendingDelete)}
        title={pendingDelete?.name ?? ""}
        loading={isSubmitting}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
