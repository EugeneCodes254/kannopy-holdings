"use client";

export default function DashboardHeader({ totalSavings, productCount, onAddProduct, user, onSignOut }) {
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

        {/* User avatar + sign out (mobile) */}
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center cursor-pointer">
            <span className="text-accent text-xs font-mono font-bold">
              {user?.name?.slice(0, 2).toUpperCase() || "??"}
            </span>
          </div>
          <div className="absolute right-0 top-full mt-2 w-36 bg-surface border border-border rounded-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-text font-mono text-[10px] font-bold truncate">{user?.name}</p>
              <p className="text-muted font-mono text-[9px] truncate">{user?.email}</p>
            </div>
            <button
              onClick={onSignOut}
              className="w-full px-3 py-2.5 text-left text-muted font-mono text-[10px] uppercase tracking-widest hover:text-danger transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
