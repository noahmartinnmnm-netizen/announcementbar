import {
  Page,
} from "@shopify/polaris";
import {
  ChartVerticalIcon,
  CursorIcon,
  NotificationIcon,
  PlusIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";
import { Link } from "react-router";
import type { BarStats } from "../types";
import { APP_TITLE } from "../utils/constants";

interface DashboardProps {
  stats: BarStats;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: typeof ChartVerticalIcon;
  accent?: string;
  tone?: "default" | "success" | "critical";
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "linear-gradient(135deg, #6366f1, #8b5cf6)",
  tone = "default",
}: StatCardProps) {
  const valueClass =
    tone === "success"
      ? "sab-stat-card__value sab-stat-card__value--success"
      : tone === "critical"
        ? "sab-stat-card__value sab-stat-card__value--critical"
        : "sab-stat-card__value";

  return (
    <div className="sab-stat-card" style={{ ["--accent" as string]: accent }}>
      <span className="sab-stat-card__icon">
        <Icon />
      </span>
      <p className="sab-stat-card__label">{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <Page
      fullWidth
      title={APP_TITLE}
      primaryAction={{
        content: "Create bar",
        url: "/app/bars/new",
      }}
      secondaryActions={[
        {
          content: "Manage bars",
          url: "/app/bars",
        },
      ]}
    >
      <div className="sab-dashboard">
        <section className="sab-hero">
          <div className="sab-hero__content">
            <div className="sab-hero__copy">
              <span className="sab-hero__eyebrow">
                <NotificationIcon />
                Storefront messaging
              </span>
              <h1 className="sab-hero__title">
                Turn visitors into buyers with smart announcement bars
              </h1>
              <p className="sab-hero__subtitle">
                Launch global banners, cart page promos, and cart drawer offers.
                Everything syncs instantly to your live storefront.
              </p>
            </div>
          </div>
        </section>

        <div className="sab-stat-grid">
          <StatCard
            label="Total announcement bars"
            value={stats.total}
            icon={ChartVerticalIcon}
            accent="linear-gradient(135deg, #8b5cf6, #a78bfa)"
          />
          <StatCard
            label="Live on storefront"
            value={stats.active}
            icon={CursorIcon}
            accent="linear-gradient(135deg, #10b981, #34d399)"
            tone="success"
          />
          <StatCard
            label="Draft / disabled"
            value={stats.disabled}
            icon={SettingsIcon}
            accent="linear-gradient(135deg, #f97316, #fb923c)"
            tone={stats.disabled > 0 ? "critical" : "default"}
          />
        </div>

        <div className="sab-panel">
          <h2 className="sab-panel__title">Quick actions</h2>
          <p className="sab-panel__text">
            Jump straight into the workflows merchants use most. Your settings
            are stored securely in shop metafields.
          </p>
          <div className="sab-action-grid">
            <Link className="sab-action-card" to="/app/bars/new">
              <span className="sab-action-card__icon">
                <PlusIcon />
              </span>
              <span>
                <p className="sab-action-card__heading">Create a new bar</p>
                <p className="sab-action-card__body">
                  Pick global, cart page, or cart drawer placement and publish
                  in minutes.
                </p>
              </span>
            </Link>
            <Link className="sab-action-card" to="/app/bars">
              <span className="sab-action-card__icon">
                <NotificationIcon />
              </span>
              <span>
                <p className="sab-action-card__heading">Manage announcement bars</p>
                <p className="sab-action-card__body">
                  Edit content, toggle live status, duplicate campaigns, or
                  remove outdated bars.
                </p>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
