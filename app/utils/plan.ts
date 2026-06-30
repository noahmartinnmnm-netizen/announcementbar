import type { PlanTier, ShopPlanInfo } from "../types";

interface RawShopPlan {
  displayName: string;
  partnerDevelopment: boolean;
  shopifyPlus: boolean;
}

export function normalizePlanTier(plan: RawShopPlan): PlanTier {
  if (plan.partnerDevelopment) {
    return "development";
  }

  if (plan.shopifyPlus) {
    return "plus";
  }

  const normalized = plan.displayName.trim().toLowerCase();

  if (normalized.includes("advanced")) {
    return "advanced";
  }

  if (normalized.includes("basic")) {
    return "basic";
  }

  if (normalized.includes("shopify")) {
    return "shopify";
  }

  return "unknown";
}

export function toShopPlanInfo(plan: RawShopPlan): ShopPlanInfo {
  return {
    displayName: plan.displayName,
    partnerDevelopment: plan.partnerDevelopment,
    shopifyPlus: plan.shopifyPlus,
    tier: normalizePlanTier(plan),
  };
}
