"use client";

import { signIn, signUp, forgetPassword } from "@/lib/auth/client";
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
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

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
      setError("Something went wrong.");
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
    setLoading(true);
    try {
      const res = await signUp.email({
        email: form.email,
        password: form.password,
        username: form.username,
        name: form.username,
        fetchOptions: { body: { gender: form.gender } }
      });

      if (res?.error) {
        const msg = res.error.message?.toLowerCase() || "";
        if (msg.includes("username") && msg.includes("already")) {
          setError("cool");
        } else {
          setError(res.error.message || "Sign up failed.");
        }
      } else {
        onClose?.();
      }
    } catch (e) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    setError("");
    setSuccess("");
    if (!form.email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await forgetPassword({
        email: form.email,
        redirectTo: "/reset-password",
      });
      if (res?.error) setError(res.error.message || "Failed to send email.");
      else setSuccess("Check your email for a reset link.");
    } catch (e) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      <div className="relative bg-surface border border-border rounded-sm w-full max-w-sm shadow-2xl animate-fadeUp">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent to-transparent rounded-t-sm" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
              <span className="text-bg font-display font-black text-xs">P</span>
            </div>
            <span className="font-display font-extrabold text-text text-base tracking-tight">PriceWatch</span>
          </div>
          <p className="text-white font-mono text-base tracking-widest uppercase mt-1">
            {mode === "signin" ? "Sign in to your account" : mode === "signup" ? "Create your account" : "Reset your password"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              className={`flex-1 py-3 font-display font-bold text-sm tracking-widest uppercase transition-all ${
                mode === m ? "text-accent border-b-2 border-accent bg-accent/5" : "text-muted hover:text-text border-b-2 border-transparent"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="px-6 py-5 space-y-4">
          {mode === "forgot" ? (
            <div className="space-y-4 animate-fadeIn">
              <Field label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
              {/* was text-[9px] → text-sm */}
              <button onClick={() => setMode("signin")} className="text-sm font-mono text-muted uppercase tracking-tighter hover:text-accent">
                ← Back to Login
              </button>
            </div>
          ) : (
            <>
              {mode === "signup" && (
                <Field label="Username" placeholder="4–10 characters" value={form.username} onChange={set("username")} hint="Only lowercase letters allowed" />
              )}

              <Field label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />

              <div className="space-y-1">
                <Field label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
                {mode === "signin" && (
                  /* was text-[9px] → text-sm */
                  <button onClick={() => setMode("forgot")} className="text-sm font-mono text-accent uppercase tracking-tighter hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>

              {mode === "signup" && (
                <div>
                  {/* was text-[10px] → text-sm */}
                  <label className="text-muted font-mono text-sm uppercase tracking-widest block mb-1.5">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ label: "Male", value: "true" }, { label: "Female", value: "false" }].map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, gender: g.value }))}
                        className={`py-2.5 rounded-sm border font-display font-semibold text-sm tracking-widest uppercase transition-all ${
                          form.gender === g.value ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg text-muted hover:text-text"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Feedback */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-danger/10 border border-danger/30 rounded-sm">
              {/* was text-xs → text-sm */}
              <span className="text-danger text-sm mt-0.5">✕</span>
              {/* was text-[10px] → text-sm */}
              <p className="text-danger font-mono text-sm leading-relaxed uppercase">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-accent/10 border border-accent/30 rounded-sm">
              <span className="text-accent text-sm mt-0.5">✓</span>
              <p className="text-accent font-mono text-sm leading-relaxed uppercase">{success}</p>
            </div>
          )}

          {/* was text-xs → text-sm */}
          <button
            onClick={mode === "signin" ? handleSignIn : mode === "signup" ? handleSignUp : handleForgetPassword}
            disabled={loading}
            className="w-full py-3 bg-accent text-bg font-display font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-accent/90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> : null}
            {mode === "signin" ? "Sign In →" : mode === "signup" ? "Create Account →" : "Send Reset Link →"}
          </button>

          {/* was text-[9px] → text-sm */}
          <p className="text-center text-muted font-mono text-sm tracking-widest leading-relaxed">
            {mode === "signin" ? "Don't have an account? Switch to Sign Up." : mode === "signup" ? "Already have an account? Switch to Sign In." : "Suddenly remembered? Back to Sign In."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, hint }: FieldProps) {
  return (
    <div>
      {/* was text-[10px] → text-sm */}
      <label className="text-muted font-mono text-sm uppercase tracking-widest block mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-text font-mono text-sm placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
      />
      {/* was text-[9px] → text-sm */}
      {hint && <p className="text-muted font-mono text-sm mt-1 tracking-wide">{hint}</p>}
    </div>
  );
}
