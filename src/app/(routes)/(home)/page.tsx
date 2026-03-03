"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProductGrid from "@/components/ProductGrid";
import AddProductModal from "@/components/AddProductModal";
import TrackingDetail from "@/components/TrackingDetail";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    category: "Electronics",
    msrp: 399.99,
    currentPrice: 342.50,
    lowestFound: 318.00,
    period: 90,
    daysElapsed: 47,
    status: "tracking",
    fraudRisk: "low",
    image: "🎧",
  },
  {
    id: 2,
    name: 'Samsung 65" QLED TV',
    category: "Electronics",
    msrp: 1299.99,
    currentPrice: 1089.00,
    lowestFound: 1089.00,
    period: 60,
    daysElapsed: 23,
    status: "deal_available",
    fraudRisk: "low",
    image: "📺",
  },
  {
    id: 3,
    name: "Nike Air Max 270",
    category: "Footwear",
    msrp: 150.00,
    currentPrice: 138.00,
    lowestFound: 127.50,
    period: 30,
    daysElapsed: 18,
    status: "tracking",
    fraudRisk: "medium",
    image: "👟",
  },
  {
    id: 4,
    name: "Dyson V15 Vacuum",
    category: "Home",
    msrp: 749.99,
    currentPrice: 699.99,
    lowestFound: 699.99,
    period: 90,
    daysElapsed: 90,
    status: "completed",
    fraudRisk: "low",
    image: "🧹",
  },
];

export default function DashboardPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const totalSavings = products.reduce((acc, p) => acc + Math.max(0, p.msrp - p.lowestFound), 0);

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [
      ...prev,
      { ...newProduct, id: Date.now(), daysElapsed: 0, status: "tracking", fraudRisk: "low" },
    ]);
    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen bg-bg relative z-10">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="flex-1 flex flex-col lg:ml-64 pb-16 lg:pb-0">
        <DashboardHeader
          totalSavings={totalSavings}
          productCount={products.length}
          onAddProduct={() => setShowAddModal(true)}
        />
        <main className="flex-1 p-6 lg:p-8">
          {selectedProduct ? (
            <TrackingDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
          ) : (
            <ProductGrid
              products={products}
              onSelect={setSelectedProduct}
              onAddProduct={() => setShowAddModal(true)}
            />
          )}
        </main>
      </div>
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} />
      )}
    </div>
  );
}

