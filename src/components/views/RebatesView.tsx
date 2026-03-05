"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import { getRebates } from "@/action/rebatesAction";

type RebateStatus = "paid" | "pending" | "processing";

interface Rebate {
  id: string;
  productId: string;
  status: RebateStatus;
  gross: number;
  fee: number;
  net: number;
  createdAt: Date | null;
}

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}

const STATUS: Record<RebateStatus, StatusConfig> = {
  paid:       { label: "PAID",       color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  pending:    { label: "PENDING",    color: "text-warn",   bg: "bg-warn/10",   border: "border-warn/20" },
  processing: { label: "PROCESSING", color: "text-text",   bg: "bg-white/5",   border: "border-border" },
};

export default function RebatesView() {
  const [rebates, setRebates] = useState<Rebate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string>("");

  useEffect(() => {
    getRebates()
      .then(setRebates)
      .catch(() => setError("Failed to load rebates."))
      .finally(() => setLoading(false));
  }, []);

  const totalPaid    = rebates.filter(r => r.status === "paid").reduce((a, r) => a + r.net, 0);
  const totalPending = rebates.filter(r => r.status !== "paid").reduce((a, r) => a + r.net, 0);

  return (
    <div className="animate-fadeUp">
      <div className="mb-6">
        <h2 className="font-display font-extrabold text-text text-2xl">Rebates</h2>
        <p className="text-muted font-mono text-[10px] tracking-widest uppercase mt-1">
          Your savings history and pending payouts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {[
          { label: "Total Paid Out",  value: `$${totalPaid.toFixed(2)}`,                 color: "text-accent", sub: "in your account" },
          { label: "Pending Rebates", value: `$${totalPending.toFixed(2)}`,               color: "text-warn",   sub: "awaiting payout" },
          { label: "Total Saved",     value: `$${(totalPaid + totalPending).toFixed(2)}`, color: "text-text",   sub: "lifetime savings" },
        ].map((s, i) => (
          <div key={i} className="bg-surface border border-border rounded-sm px-5 py-4">
            <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-1">{s.label}</p>
            <p className={clsx("font-display font-extrabold text-2xl", s.color)}>{s.value}</p>
            <p className="text-muted font-mono text-[10px] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase">Rebate History</p>
        <div className="flex-1 h-px bg-border" />
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-4">
            <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
            <p className="text-muted font-mono text-[10px] tracking-widest uppercase">Loading rebates...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-danger/10 border border-danger/30 rounded-sm">
          <p className="text-danger font-mono text-[10px]">{error}</p>
        </div>
      )}

      {!loading && !error && rebates.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-sm">
          <p className="text-muted font-mono text-2xl">↩</p>
          <p className="text-muted font-display font-bold text-sm mt-2">No rebates yet</p>
          <p className="text-muted font-mono text-[10px] mt-1 tracking-widest">Cash out a deal to earn your first rebate</p>
        </div>
      )}

      {!loading && rebates.length > 0 && (
        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          {rebates.map((r, i) => {
            const st = STATUS[r.status] ?? STATUS.pending;
            const date = r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "—";
            return (
              <div key={r.id} className={clsx("flex items-center gap-4 px-5 py-4", i < rebates.length - 1 && "border-b border-border")}>
                <div className="w-9 h-9 bg-bg border border-border rounded-sm flex items-center justify-center text-lg flex-shrink-0">
                  🛍️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-text text-sm truncate">Product #{r.productId.slice(0, 8)}</p>
                  <p className="text-muted font-mono text-[10px] mt-0.5">{date}</p>
                </div>
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
      )}

      <div className="mt-6 flex items-start gap-3 px-4 py-3 bg-accent/5 border border-accent/15 rounded-sm">
        <span className="text-accent text-sm mt-0.5">✓</span>
        <p className="text-muted font-mono text-[10px] leading-relaxed">
          <span className="text-accent font-bold">Money-back guarantee</span> — if we don&apos;t find at least 10% savings during your tracking window, you get a full refund of any service fees paid.
        </p>
      </div>
    </div>
  );
}
