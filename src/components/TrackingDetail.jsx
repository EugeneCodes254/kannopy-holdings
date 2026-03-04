"use client";

import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
// import { updateProduct, deleteProduct } from "@/actions/products";
// import { createRebate } from "@/actions/rebatesAction";
import clsx from "clsx";
import { deleteProduct, updateProduct } from "@/action/productsAction";
import { createRebate } from "@/action/rebatesAction";

function generatePriceHistory(msrp, daysElapsed, lowestFound) {
  const data = [];
  let price = msrp;
  for (let i = 0; i <= daysElapsed; i++) {
    const delta = (Math.random() - 0.52) * msrp * 0.025;
    price = Math.max(lowestFound * 0.97, Math.min(msrp * 1.02, price + delta));
    data.push({ day: i, price: parseFloat(price.toFixed(2)) });
  }
  const midIdx = Math.floor(daysElapsed * 0.6);
  if (data[midIdx]) data[midIdx].price = lowestFound;
  return data;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-sm px-3 py-2 shadow-xl">
        <p className="text-muted font-mono text-[9px] tracking-widest uppercase mb-1">Day {label}</p>
        <p className="text-accent font-display font-bold text-sm">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function TrackingDetail({ product, onBack, onDelete }) {
  const [showCashOut, setShowCashOut]         = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");

  const priceHistory = useMemo(
    () => generatePriceHistory(product.msrp, product.daysElapsed, product.lowestFound),
    [product]
  );

  const savings     = product.msrp - product.lowestFound;
  const savingsPct  = ((savings / product.msrp) * 100).toFixed(1);
  const currentDrop = (((product.msrp - product.currentPrice) / product.msrp) * 100).toFixed(1);
  const daysLeft    = product.period - product.daysElapsed;
  const progress    = (product.daysElapsed / product.period) * 100;
  const serviceFee  = savings * 0.15;
  const netRebate   = savings - serviceFee;

  // Cash out → mark completed + create rebate
  const handleCashOut = async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([
        updateProduct(product.id, { status: "completed" }),
        createRebate({ productId: product.id, msrp: product.msrp, paidPrice: product.lowestFound }),
      ]);
      setShowCashOut(false);
      onBack();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Stop tracking → delete product
  const handleStopTracking = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteProduct(product.id);
      setShowStopConfirm(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeUp">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted hover:text-accent font-mono text-xs tracking-widest uppercase mb-6 transition-colors"
      >
        ← Back to Dashboard
      </button>

      {error && (
        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-sm">
          <p className="text-danger font-mono text-[10px]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: chart + info */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-surface border border-border rounded-sm p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-bg rounded-sm border border-border flex items-center justify-center text-3xl">
                {product.image}
              </div>
              <div className="flex-1">
                <h2 className="font-display font-extrabold text-text text-xl">{product.name}</h2>
                <p className="text-muted font-mono text-[10px] uppercase tracking-widest mt-0.5">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-muted font-mono text-[10px] uppercase tracking-widest">Your MSRP</p>
                <p className="font-display font-extrabold text-2xl text-text">${product.msrp.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-muted font-mono text-[10px] tracking-widest">Tracking Progress — {product.period}-day window</p>
                <p className="text-accent font-mono text-[10px] font-bold">{daysLeft} days left</p>
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted font-mono text-[9px]">Day 0</span>
                <span className="text-muted font-mono text-[9px]">Day {product.daysElapsed}</span>
                <span className="text-muted font-mono text-[9px]">Day {product.period}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-display font-bold text-text text-sm">Price History</p>
                <p className="text-muted font-mono text-[10px] mt-0.5 tracking-widest">TRACKED OVER {product.daysElapsed} DAYS</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-accent"><span className="w-4 h-0.5 bg-accent inline-block" /> Price</span>
                <span className="flex items-center gap-1.5 text-muted"><span className="w-4 h-px bg-muted border-t border-dashed border-muted inline-block" /> MSRP</span>
              </div>
            </div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2030" />
                  <XAxis dataKey="day" tick={{ fill: "#3A4A5C", fontSize: 9, fontFamily: "Space Mono" }} tickLine={false} axisLine={{ stroke: "#1A2030" }} tickFormatter={(v) => `D${v}`} interval={Math.floor(product.daysElapsed / 6)} />
                  <YAxis tick={{ fill: "#3A4A5C", fontSize: 9, fontFamily: "Space Mono" }} tickLine={false} axisLine={{ stroke: "#1A2030" }} tickFormatter={(v) => `$${v}`} domain={["auto", "auto"]} width={55} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={product.msrp} stroke="#3A4A5C" strokeDasharray="4 4" strokeWidth={1} />
                  <ReferenceLine y={product.lowestFound} stroke="#00FF87" strokeDasharray="4 4" strokeWidth={1} opacity={0.4} />
                  <Line type="monotone" dataKey="price" stroke="#00FF87" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#00FF87", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: stats + actions */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-sm p-5 space-y-4">
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Price Intelligence</p>
            {[
              { label: "Current Market Price", value: `$${product.currentPrice.toFixed(2)}`, color: "text-text",   sub: `${currentDrop}% below MSRP` },
              { label: "Lowest Price Found",   value: `$${product.lowestFound.toFixed(2)}`,  color: "text-accent", sub: `${savingsPct}% savings` },
              { label: "Gross Savings",        value: `$${savings.toFixed(2)}`,               color: "text-accent", sub: "vs your MSRP" },
              { label: "Service Fee (15%)",    value: `-$${serviceFee.toFixed(2)}`,           color: "text-warn",   sub: "platform fee" },
              { label: "Your Net Rebate",      value: `$${netRebate.toFixed(2)}`,             color: "text-accent", sub: "estimated payout" },
            ].map((item, i) => (
              <div key={i} className={clsx("pb-3", i < 4 && "border-b border-border")}>
                <p className="text-muted font-mono text-[9px] uppercase tracking-widest mb-1">{item.label}</p>
                <p className={clsx("font-display font-bold text-lg", item.color)}>{item.value}</p>
                <p className="text-muted font-mono text-[9px] mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border rounded-sm p-5">
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">AI Fraud Check</p>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-sm flex items-center justify-center text-accent text-sm">✓</div>
              <div>
                <p className="font-display font-semibold text-text text-sm">Source Verified</p>
                <p className="text-muted font-mono text-[9px] tracking-widest">LOW FRAUD RISK</p>
              </div>
            </div>
            <p className="text-muted font-mono text-[10px] leading-relaxed">
              Seller reputation score: <span className="text-accent font-bold">94/100</span>. No suspicious price manipulation detected.
            </p>
          </div>

          {product.status === "deal_available" && (
            <div className="bg-warn/5 border border-warn/25 rounded-sm p-5">
              <p className="font-mono text-[10px] text-warn uppercase tracking-widest mb-2">⚡ Deal Available Now</p>
              <p className="text-muted font-mono text-[10px] mb-4 leading-relaxed">
                A price drop was found. Cash out now or keep tracking for potentially bigger savings.
              </p>
              <button onClick={() => setShowCashOut(true)} className="w-full py-3 bg-warn text-bg font-display font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-warn/90 active:scale-95 transition-all mb-2">
                Cash Out Now
              </button>
              <button className="w-full py-3 border border-border text-muted font-display font-semibold text-xs tracking-widest uppercase rounded-sm hover:text-text hover:border-accent/30 transition-all">
                Keep Tracking
              </button>
            </div>
          )}

          {product.status === "tracking" && (
            <div className="bg-surface border border-border rounded-sm p-5">
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Actions</p>
              <button onClick={() => setShowStopConfirm(true)} className="w-full py-3 border border-border text-muted font-display font-semibold text-xs tracking-widest uppercase rounded-sm hover:text-danger hover:border-danger/30 transition-all">
                Stop Tracking
              </button>
            </div>
          )}

          {product.status === "completed" && (
            <div className="bg-accent/5 border border-accent/20 rounded-sm p-5">
              <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2">✓ Completed</p>
              <p className="text-muted font-mono text-[10px] leading-relaxed">
                This item has been cashed out. Check your rebate in the Rebates tab.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cash Out Modal */}
      {showCashOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !loading && setShowCashOut(false)} />
          <div className="relative bg-surface border border-warn/30 rounded-sm p-6 w-full max-w-sm animate-fadeUp">
            <p className="font-display font-extrabold text-warn text-xl mb-1">Confirm Cash Out</p>
            <p className="text-muted font-mono text-[10px] tracking-widest mb-5">YOU ARE LOCKING IN THIS DEAL</p>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-muted font-mono text-xs">Best price found</span>
                <span className="text-text font-mono text-xs font-bold">${product.lowestFound.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted font-mono text-xs">Service fee (15%)</span>
                <span className="text-warn font-mono text-xs font-bold">-${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted font-mono text-xs">Your net rebate</span>
                <span className="text-accent font-mono text-xs font-bold">${netRebate.toFixed(2)}</span>
              </div>
            </div>
            {error && <p className="text-danger font-mono text-[10px] mb-3">{error}</p>}
            <button onClick={handleCashOut} disabled={loading} className="w-full py-3 bg-warn text-bg font-display font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-warn/90 active:scale-95 transition-all mb-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />Processing...</> : "Confirm & Cash Out"}
            </button>
            <button onClick={() => setShowCashOut(false)} disabled={loading} className="w-full py-2.5 text-muted font-mono text-xs tracking-widest hover:text-text transition-colors disabled:opacity-40">
              Cancel — Keep Tracking
            </button>
          </div>
        </div>
      )}

      {/* Stop Tracking Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !loading && setShowStopConfirm(false)} />
          <div className="relative bg-surface border border-danger/30 rounded-sm p-6 w-full max-w-sm animate-fadeUp">
            <p className="font-display font-extrabold text-danger text-xl mb-1">Stop Tracking?</p>
            <p className="text-muted font-mono text-[10px] tracking-widest mb-4">THIS CANNOT BE UNDONE</p>
            <p className="text-muted font-mono text-[10px] leading-relaxed mb-5">
              This will permanently delete <span className="text-text font-bold">{product.name}</span> from your trackers. Any savings found so far will be lost.
            </p>
            {error && <p className="text-danger font-mono text-[10px] mb-3">{error}</p>}
            <button onClick={handleStopTracking} disabled={loading} className="w-full py-3 bg-danger text-bg font-display font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-danger/90 active:scale-95 transition-all mb-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />Deleting...</> : "Yes, Stop Tracking"}
            </button>
            <button onClick={() => setShowStopConfirm(false)} disabled={loading} className="w-full py-2.5 text-muted font-mono text-xs tracking-widest hover:text-text transition-colors disabled:opacity-40">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
