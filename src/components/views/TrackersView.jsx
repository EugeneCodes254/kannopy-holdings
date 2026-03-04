"use client";

import clsx from "clsx";

const STATUS_CONFIG = {
  tracking:       { label: "TRACKING",   color: "text-accent",  dot: "bg-accent" },
  deal_available: { label: "DEAL FOUND", color: "text-warn",    dot: "bg-warn" },
  completed:      { label: "COMPLETED",  color: "text-muted",   dot: "bg-muted" },
};

export default function TrackersView({ products, onSelect }) {
  const groups = {
    deal_available: products.filter(p => p.status === "deal_available"),
    tracking:       products.filter(p => p.status === "tracking"),
    completed:      products.filter(p => p.status === "completed"),
  };

  return (
    <div className="animate-fadeUp">
      <div className="mb-6">
        <h2 className="font-display font-extrabold text-text text-2xl">My Trackers</h2>
        <p className="text-muted font-mono text-[10px] tracking-widest uppercase mt-1">
          {products.length} items · All your active and completed tracking sessions
        </p>
      </div>

      {Object.entries(groups).map(([status, items]) => {
        if (!items.length) return null;
        const cfg = STATUS_CONFIG[status];
        return (
          <div key={status} className="mb-8">
            {/* Group header */}
            <div className="flex items-center gap-3 mb-3">
              <span className={clsx("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
              <p className={clsx("font-mono text-[10px] tracking-widest uppercase font-bold", cfg.color)}>{cfg.label}</p>
              <span className="text-muted font-mono text-[10px]">({items.length})</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Table */}
            <div className="bg-surface border border-border rounded-sm overflow-hidden">
              {items.map((product, i) => {
                const savings = product.msrp - product.lowestFound;
                const savingsPct = ((savings / product.msrp) * 100).toFixed(1);
                const progress = (product.daysElapsed / product.period) * 100;
                return (
                  <button
                    key={product.id}
                    onClick={() => onSelect(product)}
                    className={clsx(
                      "w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-all group",
                      i < items.length - 1 && "border-b border-border"
                    )}
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 bg-bg border border-border rounded-sm flex items-center justify-center text-lg flex-shrink-0">
                      {product.image}
                    </div>

                    {/* Name + category */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-text text-sm truncate">{product.name}</p>
                      <p className="text-muted font-mono text-[10px] uppercase tracking-widest">{product.category}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="hidden md:block w-24">
                      <p className="text-muted font-mono text-[9px] mb-1">D{product.daysElapsed}/{product.period}</p>
                      <div className="h-1 bg-bg rounded-full overflow-hidden">
                        <div
                          className={clsx("h-full rounded-full", status === "deal_available" ? "bg-warn" : status === "completed" ? "bg-muted" : "bg-accent")}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* MSRP */}
                    <div className="hidden lg:block text-right w-24">
                      <p className="text-muted font-mono text-[9px] uppercase tracking-widest">MSRP</p>
                      <p className="text-text font-mono text-xs font-bold">${product.msrp.toFixed(2)}</p>
                    </div>

                    {/* Savings */}
                    <div className="text-right w-24">
                      <p className="text-muted font-mono text-[9px] uppercase tracking-widest">Best Save</p>
                      <p className={clsx("font-mono text-xs font-bold", savings > 0 ? "text-accent" : "text-muted")}>
                        {savings > 0 ? `-$${savings.toFixed(2)}` : "—"}
                      </p>
                      {savings > 0 && <p className="text-accent font-mono text-[9px]">{savingsPct}% off</p>}
                    </div>

                    <span className="text-muted text-xs group-hover:text-accent transition-colors ml-2">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
