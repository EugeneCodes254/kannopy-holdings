"use client";
import { useState } from "react";
import { DashboardHeaderProps } from "@/type/dashbordHeaderProps";
export default function DashboardHeader({
  totalSavings,
  productCount,
  onAddProduct,
  user,
  onSignOut,
}: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="font-display font-extrabold text-text text-base sm:text-lg tracking-tight">
            Tracking Dashboard
          </h1>
          {/* was text-[9px] sm:text-[10px] → text-xs sm:text-sm */}
          <p className="text-muted font-mono text-xs sm:text-sm tracking-widest uppercase mt-0.5">
            {dateStr}
          </p>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Add button */}
          {/* was text-[10px] sm:text-xs → text-xs sm:text-sm */}
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-accent text-bg font-display font-bold text-xs sm:text-sm tracking-widest uppercase rounded-sm hover:bg-accent/90 active:scale-95 transition-all"
          >
            <span className="text-base leading-none">+</span>
            Track Item
          </button>
          {/* Avatar */}
          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center cursor-pointer"
            >
              {/* was text-xs → text-sm */}
              <span className="text-accent text-sm font-mono font-bold">
                {user?.name?.slice(0, 2).toUpperCase() || "??"}
              </span>
            </div>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-sm shadow-xl z-50">
                <div className="px-3 py-2.5 border-b border-border">
                  {/* was text-[10px] → text-sm */}
                  <p className="text-text font-mono text-sm font-bold truncate">
                    {user?.name}
                  </p>
                  {/* was text-[9px] → text-xs */}
                  <p className="text-muted font-mono text-xs truncate">
                    {user?.email}
                  </p>
                </div>
                {/* was text-[10px] → text-sm */}
                <button
                  onClick={onSignOut}
                  className="w-full px-3 py-2.5 text-left text-muted font-mono text-sm uppercase tracking-widest hover:text-danger transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
