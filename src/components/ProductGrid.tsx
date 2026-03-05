"use client";


import clsx from "clsx";
import { ProductCardProps, ProductGridProps, RISK_CONFIG, StatCardProps, STATUS_CONFIG } from "@/type/productGridProps";

function StatCard({ label, value, unit, delay }: StatCardProps) {
  return (
    <div
      className="bg-surface border border-border rounded-sm px-5 py-4 animate-fadeUp"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-1">{label}</p>
      <p className="font-display font-extrabold text-2xl text-text">{value}</p>
      <p className="text-muted font-mono text-[10px] mt-0.5">{unit}</p>
    </div>
  );
}

function ProductCard({ product, onSelect, delay }: ProductCardProps) {
  const savings = product.msrp - product.lowestFound;
  const savingsPct = ((savings / product.msrp) * 100).toFixed(1);
  const progress = (product.daysElapsed / product.period) * 100;
  const statusCfg = STATUS_CONFIG[product.status];
  const riskCfg = RISK_CONFIG[product.fraudRisk];

  return (
    <button
      onClick={() => onSelect(product)}
      className="bg-surface rounded-sm p-5 text-left hover:bg-white/[0.02] transition-all duration-200 group animate-fadeUp border"
      style={{
        borderColor: product.status === "deal_available" ? "rgba(255,184,0,0.25)" : "#1A2030",
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bg rounded-sm flex items-center justify-center text-xl border border-border">
            {product.image}
          </div>
          <div>
            <p className="font-display font-bold text-text text-sm leading-tight">{product.name}</p>
            <p className="text-muted font-mono text-[10px] uppercase tracking-widest mt-0.5">{product.category}</p>
          </div>
        </div>
        <div
          className={clsx("flex items-center gap-1.5 px-2 py-1 rounded-sm border text-[10px] font-mono tracking-widest", statusCfg.color, statusCfg.border)}
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", statusCfg.dot, product.status !== "completed" && "animate-pulse2")} />
          {statusCfg.label}
        </div>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-1">Current Price</p>
          <p className="font-display font-extrabold text-2xl text-text">${product.currentPrice.toFixed(2)}</p>
          <p className="text-muted font-mono text-[10px] mt-0.5 line-through">MSRP ${product.msrp.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-1">Best Found</p>
          <p className={clsx("font-display font-bold text-lg", savings > 0 ? "text-accent" : "text-muted")}>
            ${product.lowestFound.toFixed(2)}
          </p>
          <p className={clsx("font-mono text-[10px]", savings > 0 ? "text-accent" : "text-muted")}>-{savingsPct}% off</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-muted font-mono text-[10px] tracking-widest">Day {product.daysElapsed} / {product.period}</p>
          <p className="text-muted font-mono text-[10px]">{Math.round(progress)}%</p>
        </div>
        <div className="h-1 bg-bg rounded-full overflow-hidden">
          <div
            className={clsx("h-full rounded-full transition-all duration-700", product.status === "deal_available" ? "bg-warn" : "bg-accent")}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-muted font-mono text-[10px]">AI Check:</span>
          <span className={clsx("font-mono text-[10px] font-bold tracking-widest", riskCfg.color)}>{riskCfg.label}</span>
        </div>
        <span className="text-muted font-mono text-[10px] group-hover:text-accent transition-colors">View Details →</span>
      </div>
    </button>
  );
}

export default function ProductGrid({ products, onSelect, onAddProduct }: ProductGridProps) {
  const avgSaving = products.reduce((a, p) => a + ((p.msrp - p.lowestFound) / p.msrp) * 100, 0) / products.length;

  const stats = [
    { label: "Tracking", value: products.filter(p => p.status === "tracking").length, unit: "items" },
    { label: "Deals Found", value: products.filter(p => p.status === "deal_available").length, unit: "ready" },
    { label: "Avg Saving", value: `${Math.round(avgSaving)}%`, unit: "off MSRP" },
    { label: "Completed", value: products.filter(p => p.status === "completed").length, unit: "items" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 60} />)}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase">Active Trackers</p>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} onSelect={onSelect} delay={i * 80} />
        ))}
        <button
          onClick={onAddProduct}
          className="border border-dashed border-border rounded-sm p-5 flex flex-col items-center justify-center gap-3 hover:border-accent/40 hover:bg-white/[0.02] transition-all duration-200 min-h-[240px] group"
        >
          <div className="w-10 h-10 border border-dashed border-border rounded-sm flex items-center justify-center text-muted group-hover:border-accent/40 group-hover:text-accent transition-all text-xl">
            +
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-muted text-sm group-hover:text-text transition-colors">Track New Item</p>
            <p className="text-muted font-mono text-[10px] mt-1 tracking-widest">Set MSRP + period</p>
          </div>
        </button>
      </div>
    </div>
  );
}
