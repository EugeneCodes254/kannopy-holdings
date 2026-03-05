export interface DashboardHeaderProps {
  totalSavings: number;
  productCount: number;
  onAddProduct: () => void;
  user: { name?: string; email?: string } | null;
  onSignOut: () => void;
}
