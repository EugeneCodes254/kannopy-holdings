"use client";

import { AddProductModalProps } from "@/type/productForm";
import { useState } from "react";
import { string } from "zod";

const CATEGORIES = [
  "Electronics",
  "Footwear",
  "Home",
  "Clothing",
  "Sports",
  "Toys",
  "Other",
];

const PERIODS = [
  { value: 30, label: "30 Days", desc: "Short sprint" },
  { value: 60, label: "60 Days", desc: "Standard" },
  { value: 90, label: "90 Days", desc: "Best savings" },
];

const EMOJIS = [
  "🎧","📺","👟","🧹","💻","📱",
  "🎮","🪑","📷","⌚","🖥️","🎒"
];

interface FormState {
  name: string;
  category: string;
  msrp: string;
  period: number;
  image: string;
}

export default function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    category: "Electronics",
    msrp: "",
    period: 60,
    image: "🎧",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) {
      e.name = "Product name required";
    }

    if (!form.msrp || isNaN(Number(form.msrp)) || parseFloat(form.msrp) <= 0) {
      e.msrp = "Valid MSRP required";
    }

    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setServerError("");
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const price = parseFloat(form.msrp);

      // await onAdd({
      //   name: form.name.trim(),
      //   category: form.category,
      //   image: form.image,
      //   msrp: price,
      //   period: form.period,
      // });
      await onAdd({
        name: form.name.trim(),
        category: form.category,
        image: form.image,
        msrp: price,
        period: form.period,
      })

      onClose();
    } catch (err) {
      setServerError("Failed to create tracker. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-sm w-full max-w-md animate-fadeUp shadow-2xl">

        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-text text-base">
              Track New Item
            </h2>
            <p className="text-muted font-mono text-[10px] mt-0.5 tracking-widest">
              SET MSRP · CHOOSE PERIOD
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-muted hover:text-text transition-colors text-xl w-8 h-8 flex items-center justify-center disabled:opacity-40"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="px-6 py-5 space-y-5">

            {/* Emoji Picker */}
            <div>
              <p className="text-muted font-mono text-[10px] uppercase tracking-widest mb-2">
                Item Icon
              </p>

              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, image: emoji }))
                    }
                    className={`w-9 h-9 rounded-sm border text-lg transition-all ${
                      form.image === emoji
                        ? "border-accent bg-accent/10"
                        : "border-border bg-bg hover:border-accent/40"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="text-muted font-mono text-[10px] uppercase tracking-widest block mb-1.5">
                Product Name *
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  clearFieldError("name");
                }}
                placeholder="e.g. Sony WH-1000XM5"
                className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-text font-mono text-sm placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
              />

              {errors.name && (
                <p className="text-danger font-mono text-[10px] mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-muted font-mono text-[10px] uppercase tracking-widest block mb-1.5">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-text font-mono text-sm focus:outline-none focus:border-accent/60 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* MSRP */}
            <div>
              <label className="text-muted font-mono text-[10px] uppercase tracking-widest block mb-1.5">
                Your MSRP / Max Budget *
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">
                  $
                </span>

                <input
                  type="number"
                  value={form.msrp}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, msrp: e.target.value }));
                    clearFieldError("msrp");
                  }}
                  placeholder="0.00"
                  className="w-full bg-bg border border-border rounded-sm pl-7 pr-3 py-2.5 text-text font-mono text-sm placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
                />
              </div>

              {errors.msrp && (
                <p className="text-danger font-mono text-[10px] mt-1">
                  {errors.msrp}
                </p>
              )}
            </div>

            {/* Period */}
            <div>
              <label className="text-muted font-mono text-[10px] uppercase tracking-widest block mb-2">
                Tracking Period
              </label>

              <div className="grid grid-cols-3 gap-2">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, period: p.value }))
                    }
                    className={`rounded-sm border py-3 px-2 text-center transition-all ${
                      form.period === p.value
                        ? "border-accent bg-accent/10"
                        : "border-border bg-bg hover:border-accent/30"
                    }`}
                  >
                    <p
                      className={`font-display font-bold text-sm ${
                        form.period === p.value
                          ? "text-accent"
                          : "text-text"
                      }`}
                    >
                      {p.label}
                    </p>
                    <p className="text-muted font-mono text-[9px] mt-0.5 tracking-widest">
                      {p.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-danger/10 border border-danger/30 rounded-sm">
                <span className="text-danger text-xs mt-0.5">✕</span>
                <p className="text-danger font-mono text-[10px]">
                  {serverError}
                </p>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 border border-border rounded-sm text-muted font-display font-semibold text-xs tracking-widest uppercase hover:text-text hover:border-accent/30 transition-all disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-accent text-bg rounded-sm font-display font-bold text-xs tracking-widest uppercase hover:bg-accent/90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Start Tracking"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
