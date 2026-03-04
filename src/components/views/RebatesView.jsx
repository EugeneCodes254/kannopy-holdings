"use client";

import clsx from "clsx";

const REBATES = [
  { id: 1, name: "Dyson V15 Vacuum", image: "🧹", msrp: 749.99, paidPrice: 699.99, gross: 50.00, fee: 7.50, net: 42.50, status: "paid", date: "Feb 12, 2026" },
  { id: 2, name: 'Samsung 65" QLED TV', image: "📺", msrp: 1299.99, paidPrice: 1089.00, gross: 210.99, fee: 31.65, net: 179.34, status: "pending", date: "Est. Mar 15, 2026" },
  { id: 3, name: "Sony WH-1000XM5", image: "🎧", msrp: 399.99, paidPrice: 318.00, gross: 81.99, fee: 12.30, net: 69.69, status: "processing", date: "Est. Apr 20, 2026" },
];

const STATUS = {
  paid:       { label: "PAID",       color: "text-accent",  bg: "bg-accent/10",  border: "border-accent/20" },
  pending:    { label: "PENDING",    color: "text-warn",    bg: "bg-warn/10",    border: "border-warn/20" },
  processing: { label: "PROCESSING", color: "text-text",    bg: "bg-white/5",    border: "border-border" },
};

export default function RebatesView() {
  const totalPaid = REBATES.filter(r => r.status === "paid").reduce((a, r) => a + r.net, 0);
  const totalPending = REBATES.filter(r => r.status !== "paid").reduce((a, r) => a + r.net, 0);

  return (
    <div className="animate-fadeUp">
      <div className="mb-6">
        <h2 className="font-display font-extrabold text-text text-2xl">Rebates</h2>
        <p className="text-muted font-mono text-[10px] tracking-widest uppercase mt-1">
          Your savings history and pending payouts
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {[
          { label: "Total Paid Out", value: `$${totalPaid.toFixed(2)}`, color: "text-accent", sub: "in your account" },
          { label: "Pending Rebates", value: `$${totalPending.toFixed(2)}`, color: "text-warn", sub: "awaiting payout" },
          { label: "Total Saved", value: `$${(totalPaid + totalPending).toFixed(2)}`, color: "text-text", sub: "lifetime savings" },
        ].map((s, i) => (
          <div key={i} className="bg-surface border border-border rounded-sm px-5 py-4">
            <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-1">{s.label}</p>
            <p className={clsx("font-display font-extrabold text-2xl", s.color)}>{s.value}</p>
            <p className="text-muted font-mono text-[10px] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Rebate rows */}
      <div className="flex items-center gap-4 mb-4">
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase">Rebate History</p>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-surface border border-border rounded-sm overflow-hidden">
        {REBATES.map((r, i) => {
          const st = STATUS[r.status];
          return (
            <div
              key={r.id}
              className={clsx("flex items-center gap-4 px-5 py-4", i < REBATES.length - 1 && "border-b border-border")}
            >
              <div className="w-9 h-9 bg-bg border border-border rounded-sm flex items-center justify-center text-lg flex-shrink-0">
                {r.image}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-text text-sm truncate">{r.name}</p>
                <p className="text-muted font-mono text-[10px] mt-0.5">{r.date}</p>
              </div>

              {/* Breakdown — hidden on small screens */}
              <div className="hidden lg:flex items-center gap-6 text-right">
                <div>
                  <p className="text-muted font-mono text-[9px] uppercase tracking-widest">Gross Save</p>
                  <p className="text-text font-mono text-xs font-bold">${r.gross.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted font-mono text-[9px] uppercase tracking-widest">Fee (15%)</p>
                  <p className="text-danger font-mono text-xs font-bold">-${r.fee.toFixed(2)}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-muted font-mono text-[9px] uppercase tracking-widest">Net Rebate</p>
                <p className="text-accent font-display font-bold text-base">${r.net.toFixed(2)}</p>
              </div>

              <div className={clsx("px-2 py-1 rounded-sm border text-[10px] font-mono tracking-widest flex-shrink-0", st.color, st.bg, st.border)}>
                {st.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee note */}
      <div className="mt-6 flex items-start gap-3 px-4 py-3 bg-accent/5 border border-accent/15 rounded-sm">
        <span className="text-accent text-sm mt-0.5">✓</span>
        <p className="text-muted font-mono text-[10px] leading-relaxed">
          <span className="text-accent font-bold">Money-back guarantee</span> — if we don&apos;t find at least 10% savings during your tracking window, you get a full refund of any service fees paid.
        </p>
      </div>
    </div>
  );
}
