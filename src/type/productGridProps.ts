import { Product } from "@/db/schema";

export const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; border: string }> = {
  tracking: { label: "TRACKING", color: "text-accent", dot: "bg-accent", border: "border-accent/20" },
  deal_available: { label: "DEAL FOUND", color: "text-warn", dot: "bg-warn", border: "border-warn/30" },
  completed: { label: "COMPLETED", color: "text-muted", dot: "bg-muted", border: "border-border" },
};

export const RISK_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "VERIFIED", color: "text-accent" },
  medium: { label: "REVIEW", color: "text-warn" },
  high: { label: "RISK", color: "text-danger" },
};

export interface StatCardProps {
  label: string;
  value: string | number;
  unit: string;
  delay: number;
}

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  delay: number;
}

export interface ProductGridProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onAddProduct: () => void;
}

