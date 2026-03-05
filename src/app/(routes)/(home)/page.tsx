
"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProductGrid from "@/components/ProductGrid";
import AddProductModal from "@/components/AddProductModal";
import TrackingDetail from "@/components/TrackingDetail";
import AuthModal from "@/components/Authmodel";

import LiveDealsView from "@/components/views/LiveDealsView";
import TrackersView from "@/components/views/TrackersView";
import RebatesView from "@/components/views/RebatesView";
import SettingsView from "@/components/views/SettingsView";
import { signOut, useSession } from "@/lib/auth/client";

import { getProducts, createProduct, deleteProduct } from "@/action/productsAction";
import { LandingGate } from "@/utils/landingGate";
import { Product } from "@/db/schema";
import { ProductFormData } from "@/type/productFormData";


export default function Page() {
  const { data: session, isPending } = useSession();

  const [showAuthModal, setShowAuthModal]     = useState(false);
  const [products, setProducts]= useState<Product[]> ([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState<Product>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const [showAddModal, setShowAddModal]       = useState(false);

  const [activeNav, setActiveNavRaw] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("activeNav") || "dashboard";
    }
    return "dashboard";
  });

  const setActiveNav = useCallback((nav : string) => {
    setActiveNavRaw(nav);
    if (typeof window !== "undefined") sessionStorage.setItem("activeNav", nav);
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    setLoadingProducts(true);
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, [session?.user?.id]);

  const handleAddProduct = async (formData : ProductFormData) => {
    try {
      const newProduct = await createProduct({
        name:     formData.name,
        category: formData.category,
        image:    formData.image,
        msrp:     formData.msrp,
        period:   formData.period,
      });
      setProducts((prev) => [...prev, newProduct]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const handleDeleteProduct = async (id : string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(undefined);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const totalSavings = products.reduce((acc, p) => acc + Math.max(0, p.msrp - p.lowestFound), 0);

  if (isPending) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
          <p className="text-muted font-mono text-[10px] tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <LandingGate onSignIn={() => setShowAuthModal(true)} />
      
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg relative z-10">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={(nav) => { setActiveNav(nav); setSelectedProduct(undefined); }}
        user={session.user}
        onSignOut={() => signOut()}
      />
      <div className="flex-1 flex flex-col lg:ml-64 pb-16 lg:pb-0">
        <DashboardHeader
          totalSavings={totalSavings}
          productCount={products.length}
          onAddProduct={() => setShowAddModal(true)}
          user={session.user}
          onSignOut={() => signOut()}
        />
        <main className="flex-1 p-6 lg:p-8">

          {/* Products loading skeleton */}
          {loadingProducts && (activeNav === "dashboard" || activeNav === "tracking") && (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
                <p className="text-muted font-mono text-[10px] tracking-widest uppercase">Fetching your trackers...</p>
              </div>
            </div>
          )}

          {/* Dashboard */}
          {!loadingProducts && activeNav === "dashboard" && (
            selectedProduct ? (
              <TrackingDetail
                product={selectedProduct}
                onBack={() => setSelectedProduct(undefined)}
                onDelete={handleDeleteProduct}
              />
            ) : (
              <ProductGrid
                products={products}
                onSelect={setSelectedProduct}
                onAddProduct={() => setShowAddModal(true)}
              />
            )
          )}

          {/* My Trackers */}
          {!loadingProducts && activeNav === "tracking" && (
            selectedProduct ? (
              <TrackingDetail
                product={selectedProduct}
                onBack={() => setSelectedProduct(undefined)}
                onDelete={handleDeleteProduct}
              />
            ) : (
              <TrackersView products={products} onSelect={setSelectedProduct} />
            )
          )}

          {/* Live Deals */}
          {activeNav === "deals" && <LiveDealsView />}

          {/* Rebates */}
          {activeNav === "rebates" && <RebatesView />}

          {/* Settings */}
          {activeNav === "settings" && <SettingsView user={session.user} />}

        </main>
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
}
