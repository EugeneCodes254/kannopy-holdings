"use client";

import clsx from "clsx";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "tracking", label: "My Trackers", icon: "◎" },
  { id: "deals", label: "Live Deals", icon: "⚡" },
  { id: "rebates", label: "Rebates", icon: "↩" },
  { id: "settings", label: "Settings", icon: "◈" },
];

export default function Sidebar({ activeNav, setActiveNav }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface border-r border-border z-20">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
              <span className="text-bg font-display font-black text-sm">P</span>
            </div>
            <div>
              <p className="font-display font-bold text-text text-sm tracking-widest uppercase">PriceWatch</p>
              <p className="text-muted text-[10px] font-mono tracking-wider">Tracking Intelligence</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all duration-200 group",
                activeNav === item.id
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-text hover:bg-white/5 border border-transparent"
              )}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="font-display font-semibold text-xs tracking-widest uppercase">
                {item.label}
              </span>
              {activeNav === item.id && (
                <span className="ml-auto w-1.5 h-1.5 bg-accent rounded-full animate-pulse2" />
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-6 py-5 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent text-xs font-mono font-bold">JD</span>
            </div>
            <div>
              <p className="text-text text-xs font-display font-semibold">John Doe</p>
              <p className="text-muted text-[10px] font-mono">Pro Plan</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse2" />
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-20 px-2 py-2 flex justify-around">
        {NAV_ITEMS.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={clsx(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-sm transition-all",
              activeNav === item.id ? "text-accent" : "text-muted"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-display tracking-widest uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
