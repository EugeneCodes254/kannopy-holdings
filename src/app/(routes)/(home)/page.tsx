// "use client";
//
// import { useState } from "react";
// // import { useSession, signOut } from "@/lib/auth-client";
// import Sidebar from "@/components/Sidebar";
// import DashboardHeader from "@/components/DashboardHeader";
// import ProductGrid from "@/components/ProductGrid";
// import AddProductModal from "@/components/AddProductModal";
// import TrackingDetail from "@/components/TrackingDetail";
// // import AuthmModel from "@/components/Authmodel"
// import { signOut, useSession } from "@/lib/auth/client";
// import AuthModal from "@/components/Authmodel";
//
// const INITIAL_PRODUCTS = [
//   {
//     id: 1,
//     name: "Sony WH-1000XM5",
//     category: "Electronics",
//     msrp: 399.99,
//     currentPrice: 342.50,
//     lowestFound: 318.00,
//     period: 90,
//     daysElapsed: 47,
//     status: "tracking",
//     fraudRisk: "low",
//     image: "🎧",
//   },
//   {
//     id: 2,
//     name: 'Samsung 65" QLED TV',
//     category: "Electronics",
//     msrp: 1299.99,
//     currentPrice: 1089.00,
//     lowestFound: 1089.00,
//     period: 60,
//     daysElapsed: 23,
//     status: "deal_available",
//     fraudRisk: "low",
//     image: "📺",
//   },
//   {
//     id: 3,
//     name: "Nike Air Max 270",
//     category: "Footwear",
//     msrp: 150.00,
//     currentPrice: 138.00,
//     lowestFound: 127.50,
//     period: 30,
//     daysElapsed: 18,
//     status: "tracking",
//     fraudRisk: "medium",
//     image: "👟",
//   },
//   {
//     id: 4,
//     name: "Dyson V15 Vacuum",
//     category: "Home",
//     msrp: 749.99,
//     currentPrice: 699.99,
//     lowestFound: 699.99,
//     period: 90,
//     daysElapsed: 90,
//     status: "completed",
//     fraudRisk: "low",
//     image: "🧹",
//   },
// ];
//
// // ─── Landing / Auth Gate ───────────────────────────────────────────────────────
//  function LandingGate({ onSignIn }: { onSignIn: () => void }) {
//    return(
//
//     <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
//       {/* Background grid */}
//       <div
//         className="absolute inset-0 opacity-[0.04]"
//         style={{
//           backgroundImage:
//             "linear-gradient(#00FF87 1px, transparent 1px), linear-gradient(90deg, #00FF87 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />
//       {/* Glow blob */}
//       <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
//
//       <div className="relative z-10 text-center max-w-lg animate-fadeUp">
//         {/* Logo */}
//         <div className="flex items-center justify-center gap-3 mb-8">
//           <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
//             <span className="text-bg font-display font-black text-base">P</span>
//           </div>
//           <span className="font-display font-extrabold text-text text-2xl tracking-tight">PriceWatch</span>
//         </div>
//
//         <h1 className="font-display font-extrabold text-text text-4xl leading-tight mb-4">
//           Track prices.<br />
//           <span className="text-accent">Earn rebates.</span>
//         </h1>
//         <p className="text-muted font-mono text-sm leading-relaxed mb-10 max-w-sm mx-auto">
//           Set your MSRP, choose a 30/60/90-day window, and let us find the best price. Guaranteed 10% savings or your money back.
//         </p>
//
//         {/* Feature pills */}
//         <div className="flex flex-wrap justify-center gap-2 mb-10">
//           {["⚡ Live price tracking", "🤖 AI fraud detection", "💰 Automatic rebates", "📦 Drop-ship direct"].map((f) => (
//             <span key={f} className="px-3 py-1.5 bg-surface border border-border rounded-sm font-mono text-[10px] text-muted tracking-widest">
//               {f}
//             </span>
//           ))}
//         </div>
//
//         <button
//           onClick={onSignIn}
//           className="px-10 py-4 bg-accent text-bg font-display font-extrabold text-sm tracking-widest uppercase rounded-sm hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/20"
//         >
//           Get Started — Sign In →
//         </button>
//         <p className="text-muted font-mono text-[10px] mt-4 tracking-widest">No credit card required to sign up</p>
//       </div>
//     </div>
//   );
// }
//
// // ─── Main Page ─────────────────────────────────────────────────────────────────
// export default function Page() {
//   const { data: session, isPending } = useSession();
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [products, setProducts] = useState(INITIAL_PRODUCTS);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [activeNav, setActiveNav] = useState("dashboard");
//
//   const totalSavings = products.reduce((acc, p) => acc + Math.max(0, p.msrp - p.lowestFound), 0);
//
//   // const handleAddProduct = (newProduct) => {
//
// const handleAddProduct = (newProduct: typeof INITIAL_PRODUCTS[number]) => {
//
//     setProducts((prev) => [
//       ...prev,
//       { ...newProduct, id: Date.now(), daysElapsed: 0, status: "tracking", fraudRisk: "low" },
//     ]);
//     setShowAddModal(false);
//   };
//
//   // Loading
//   if (isPending) {
//     return (
//       <div className="min-h-screen bg-bg flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
//           <p className="text-muted font-mono text-[10px] tracking-widest uppercase">Loading...</p>
//         </div>
//       </div>
//     );
//   }
//
//   // Not signed in
//   if (!session) {
//     return (
//       <>
//         <LandingGate onSignIn={() => setShowAuthModal(true)} />
//         {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
//       </>
//     );
//   }
//
//   // Signed in — full dashboard
//   return (
//     <div className="flex min-h-screen bg-bg relative z-10">
//       <Sidebar
//         activeNav={activeNav}
//         setActiveNav={setActiveNav}
//         user={session.user}
//         onSignOut={() => signOut()}
//       />
//       <div className="flex-1 flex flex-col lg:ml-64 pb-16 lg:pb-0">
//         <DashboardHeader
//           totalSavings={totalSavings}
//           productCount={products.length}
//           onAddProduct={() => setShowAddModal(true)}
//           user={session.user}
//           onSignOut={() => signOut()}
//         />
//         <main className="flex-1 p-6 lg:p-8">
//           {selectedProduct ? (
//             <TrackingDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
//           ) : (
//             <ProductGrid products={products} onSelect={setSelectedProduct} onAddProduct={() => setShowAddModal(true)} />
//           )}
//         </main>
//       </div>
//       {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} />}
//     </div>
//   );
// }
//

"use client";

import { useState, useEffect, useCallback } from "react";
// import { useSession, signOut } from "@/lib//auth-client";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProductGrid from "@/components/ProductGrid";
import AddProductModal from "@/components/AddProductModal";
import TrackingDetail from "@/components/TrackingDetail";
// import AuthModal from "@/components/AuthModal";
import AuthModal from "@/components/Authmodel";

import LiveDealsView from "@/components/views/LiveDealsView";
import TrackersView from "@/components/views/TrackersView";
import RebatesView from "@/components/views/RebatesView";
import SettingsView from "@/components/views/SettingsView";
import { signOut, useSession } from "@/lib/auth/client";

import { getProducts, createProduct, deleteProduct } from "@/action/productsAction";
import { LandingGate } from "@/utils/landingGate";


// ─── Landing / Auth Gate ───────────────────────────────────────────────────────



// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Page() {
  const { data: session, isPending } = useSession();

  const [showAuthModal, setShowAuthModal]     = useState(false);
  const [products, setProducts]               = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal]       = useState(false);

  const [activeNav, setActiveNavRaw] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("activeNav") || "dashboard";
    }
    return "dashboard";
  });

  const setActiveNav = useCallback((nav) => {
    setActiveNavRaw(nav);
    if (typeof window !== "undefined") sessionStorage.setItem("activeNav", nav);
  }, []);

  // ── Fetch products from DB when session is ready ───────────────────────────
  useEffect(() => {
    if (!session?.user) return;
    setLoadingProducts(true);
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, [session?.user?.id]);

  // ── Add product → insert to DB ─────────────────────────────────────────────
  const handleAddProduct = async (formData) => {
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

  // ── Delete product → DB ────────────────────────────────────────────────────
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const totalSavings = products.reduce((acc, p) => acc + Math.max(0, p.msrp - p.lowestFound), 0);

  // ── Loading spinner ────────────────────────────────────────────────────────
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

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (!session) {
    return (
      <>
        <LandingGate onSignIn={() => setShowAuthModal(true)} />
      
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }

  // ── Signed in — full dashboard ─────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-bg relative z-10">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={(nav) => { setActiveNav(nav); setSelectedProduct(null); }}
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
                onBack={() => setSelectedProduct(null)}
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
                onBack={() => setSelectedProduct(null)}
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
