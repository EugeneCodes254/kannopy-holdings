import { Product } from "@/db/schema";

export interface TrackingDetailProps {
  product: Product;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export interface PricePoint {
  day: number;
  price: number;
}
