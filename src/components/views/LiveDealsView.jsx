"use client";

import clsx from "clsx";

const DEALS = [
  { id: 1, name: "Sony WH-1000XM5", category: "Electronics", image: "🎧", msrp: 399.99, dealPrice: 289.99, source: "Amazon", fraudRisk: "low", drop: 27.5 },
  { id: 2, name: "iPad Air 11\"", category: "Electronics", image: "📱", msrp: 699.00, dealPrice: 549.00, source: "Best Buy", fraudRisk: "low", drop: 21.5 },
  { id: 3, name: "Dyson V15", category: "Home", image: "🧹", msrp: 749.99, dealPrice: 599.99, source: "Dyson.com", fraudRisk: "low", drop: 20.0 },
  { id: 4, name: "Nike Air Max 270", category: "Footwear", image: "👟", msrp: 150.00, dealPrice: 89.99, source: "Unknown Seller", fraudRisk: "high", drop: 40.0 },
  { id: 5, name: "Samsung Galaxy S25", category: "Electronics", image: "📲", msrp: 899.99, dealPrice: 749.00, source: "Samsung", fraudRisk: "low", drop: 16.8 },
  { id: 6, name: "Instant Pot Duo", category: "Home", image: "🫕", msrp: 99.99, dealPrice: 59.99, source: "Walmart", fraudRisk: "medium", drop: 40.0 },
];

const RISK = {
  low:    { label: "VERIFIED",  color: "text-accent",  bg: "bg-accent/10",  border: "border-accent/20" },
  medium: { label: "REVIEW",    color: "text-warn",    bg: "bg-warn/10",    border: "border-warn/20" },
  high:   { label: "HIGH RISK", color: "text-danger",  bg: "bg-danger/10",  border: "border-danger/20" },
};

export default function LiveDealsView() {
  return (
    <div className="animate-fadeUp">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display font-extrabold text-text text-2xl">Live Deals</h2>
        <p className="text-muted font-mono text-[10px] tracking-widest uppercase mt-1">
          AI-scanned · Fraud checked · Updated every 30 min
        </p>
      </div>

      {/* Alert banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-warn/5 border border-warn/20 rounded-sm mb-6">
        <span className="text-warn text-sm">⚠</span>
        <p className="text-warn font-mono text-[10px] tracking-widest">
          HIGH RISK deals are flagged by our AI — prices may be artificially inflated then discounted. Proceed with caution.
        </p>
      </div>

      {/* Deals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DEALS.map((deal, i) => {
          const risk = RISK[deal.fraudRisk];
          const savings = deal.msrp - deal.dealPrice;
          return (
            <div
              key={deal.id}
              className="bg-surface border border-border rounded-sm p-5 animate-fadeUp hover:border-accent/30 transition-all group"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg border border-border rounded-sm flex items-center justify-center text-xl">
                    {deal.image}
                  </div>
                  <div>
                    <p className="font-display font-bold text-text text-sm">{deal.name}</p>
                    <p className="text-muted font-mono text-[10px] uppercase tracking-widest">{deal.category}</p>
                  </div>
                </div>
                <div className={clsx("px-2 py-1 rounded-sm border text-[10px] font-mono tracking-widest", risk.color, risk.bg, risk.border)}>
                  {risk.label}
                </div>
              </div>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-1">Deal Price</p>
                  <p className="font-display font-extrabold text-2xl text-accent">${deal.dealPrice.toFixed(2)}</p>
                  <p className="text-muted font-mono text-[10px] line-through mt-0.5">MSRP ${deal.msrp.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-1">You Save</p>
                  <p className="font-display font-bold text-lg text-text">${savings.toFixed(2)}</p>
                  <p className="text-accent font-mono text-[10px]">{deal.drop}% off</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <p className="text-muted font-mono text-[10px]">via <span className="text-text">{deal.source}</span></p>
                <button
                  disabled={deal.fraudRisk === "high"}
                  className={clsx(
                    "px-3 py-1.5 rounded-sm font-display font-bold text-[10px] tracking-widest uppercase transition-all",
                    deal.fraudRisk === "high"
                      ? "bg-danger/10 text-danger border border-danger/20 cursor-not-allowed"
                      : "bg-accent text-bg hover:bg-accent/90 active:scale-95"
                  )}
                >
                  {deal.fraudRisk === "high" ? "Flagged" : "Track Deal →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
