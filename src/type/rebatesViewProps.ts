
export type RebateStatus = "paid" | "pending" | "processing";

export interface Rebate {
  id: string;
  productId: string;
  status: RebateStatus;
  gross: number;
  fee: number;
  net: number;
  createdAt: Date | null;
}

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}

export const STATUS: Record<RebateStatus, StatusConfig> = {
  paid:       { label: "PAID",       color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  pending:    { label: "PENDING",    color: "text-warn",   bg: "bg-warn/10",   border: "border-warn/20" },
  processing: { label: "PROCESSING", color: "text-text",   bg: "bg-white/5",   border: "border-border" },
};


