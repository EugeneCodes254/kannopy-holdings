"use client";

import { signIn, signUp } from "@/lib/auth/client";
import { AddauthModalProps } from "@/type/productForm";
import { useState } from "react";

interface FormState {
  email: string;
  password: string;
  username: string;
  gender: string;
}

interface FieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
}

export default function AuthModal({ onClose }: AddauthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    username: "",
    gender: "",
  });

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSignIn = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn.email({
        email: form.email,
        password: form.password,
      });
      if (res?.error) setError(res.error.message || "Sign in failed.");
      else onClose?.();
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    if (!form.email || !form.password || !form.username || form.gender === "") {
      setError("All fields are required.");
      return;
    }
    if (form.username.length < 4 || form.username.length > 10) {
      setError("Username must be 4–10 characters.");
      return;
    }
    setLoading(true);
    try {


const res = await signUp.email({
  email: form.email,
  password: form.password,
  name: form.username,
  username: form.username,
  fetchOptions: {
    body: {
      gender: form.gender,
    }
  }
});
      if (res?.error) setError(res.error.message || "Sign up failed.");
      else onClose?.();
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Card */}
      <div className="relative bg-surface border border-border rounded-sm w-full max-w-sm shadow-2xl animate-fadeUp">
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent to-transparent rounded-t-sm" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
              <span className="text-bg font-display font-black text-xs">P</span>
            </div>
            <span className="font-display font-extrabold text-text text-base tracking-tight">
              PriceWatch
            </span>
          </div>
          <p className="text-muted font-mono text-[10px] tracking-widest uppercase mt-1">
            {mode === "signin" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-3 font-display font-bold text-xs tracking-widest uppercase transition-all ${
                mode === m
                  ? "text-accent border-b-2 border-accent bg-accent/5"
                  : "text-muted hover:text-text border-b-2 border-transparent"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Username — sign up only */}
          {mode === "signup" && (
            <Field
              label="Username"
              placeholder="4–10 characters"
              value={form.username}
              onChange={set("username")}
              hint="Only lowercase letters allowed"
            />
          )}

          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
          />

          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
          />

          {/* Gender — sign up only */}
          {mode === "signup" && (
            <div>
              <label className="text-muted font-mono text-[10px] uppercase tracking-widest block mb-1.5">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[{ label: "Male", value: "true" }, { label: "Female", value: "false" }].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, gender: g.value }))}
                    className={`py-2.5 rounded-sm border font-display font-semibold text-xs tracking-widest uppercase transition-all ${
                      form.gender === g.value
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-bg text-muted hover:border-accent/30 hover:text-text"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-danger/10 border border-danger/30 rounded-sm">
              <span className="text-danger text-xs mt-0.5 flex-shrink-0">✕</span>
              <p className="text-danger font-mono text-[10px] leading-relaxed">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={mode === "signin" ? handleSignIn : handleSignUp}
            disabled={loading}
            className="w-full py-3 bg-accent text-bg font-display font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-accent/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "signin" ? (
              "Sign In →"
            ) : (
              "Create Account →"
            )}
          </button>

          {/* Guarantee note */}
          <p className="text-center text-muted font-mono text-[9px] tracking-widest leading-relaxed">
            {mode === "signin"
              ? "Don't have an account? Switch to Sign Up above."
              : "Already have an account? Switch to Sign In above."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, hint }: FieldProps) {
  return (
    <div>
      <label className="text-muted font-mono text-[10px] uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-text font-mono text-sm placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
      />
      {hint && <p className="text-muted font-mono text-[9px] mt-1 tracking-wide">{hint}</p>}
    </div>
  );
}
