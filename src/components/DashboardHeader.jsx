"use client";

export default function DashboardHeader({ totalSavings, productCount, onAddProduct }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric"
  });

  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur-sm px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="font-display font-extrabold text-text text-lg tracking-tight">
          Tracking Dashboard
        </h1>
        <p className="text-muted font-mono text-[10px] tracking-widest uppercase mt-0.5">{dateStr}</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Stats pills */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-sm">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse2" />
            <span className="text-accent font-mono text-xs font-bold">{productCount} ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-bg border border-border rounded-sm">
            <span className="text-muted font-mono text-[10px] uppercase tracking-widest">Total Saved</span>
            <span className="text-text font-mono text-xs font-bold">${totalSavings.toFixed(2)}</span>
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-bg font-display font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-accent/90 active:scale-95 transition-all duration-150"
        >
          <span className="text-base leading-none">+</span>
          Track Item
        </button>
      </div>
    </header>
  );
}
