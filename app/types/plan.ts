export type PlanTier =
  | "development"
  | "basic"
  | "shopify"
  | "advanced"
  | "plus"
  | "unknown";

export interface ShopPlanInfo {
  displayName: string;
  partnerDevelopment: boolean;
  shopifyPlus: boolean;
  tier: PlanTier;
}
