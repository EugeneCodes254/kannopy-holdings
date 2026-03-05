"use client";

import clsx from "clsx";
import { useState } from "react";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface RowProps {
  label: string;
  desc?: string;
  children?: React.ReactNode;
  danger?: boolean;
}

interface NotifState {
  dealAlerts: boolean;
  priceDrops: boolean;
  weeklyReport: boolean;
  fraudAlerts: boolean;
}

interface SettingsViewProps {
  user: { name?: string; email?: string } | null;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={clsx(
        "w-10 h-5 rounded-full relative transition-all duration-200 flex-shrink-0",
        enabled ? "bg-accent" : "bg-border"
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 w-4 h-4 bg-bg rounded-full shadow transition-all duration-200",
          enabled ? "left-[calc(100%-18px)]" : "left-0.5"
        )}
      />
    </button>
  );
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase">{title}</p>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="bg-surface border border-border rounded-sm overflow-hidden">{children}</div>
    </div>
  );
}

function Row({ label, desc, children, danger }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border last:border-0">
      <div>
        <p className={clsx("font-display font-semibold text-sm", danger ? "text-danger" : "text-text")}>{label}</p>
        {desc && <p className="text-muted font-mono text-[10px] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsView({ user }: SettingsViewProps) {
  const [notifs, setNotifs] = useState<NotifState>({
    dealAlerts: true,
    priceDrops: true,
    weeklyReport: false,
    fraudAlerts: true,
  });
  const [period, setPeriod] = useState<string>("60");

  const notifItems: { key: keyof NotifState; label: string; desc: string }[] = [
    { key: "dealAlerts",   label: "Deal Alerts",   desc: "Notify when a deal is found for tracked items" },
    { key: "priceDrops",   label: "Price Drops",   desc: "Notify on any price drop, even before period ends" },
    { key: "weeklyReport", label: "Weekly Report", desc: "Summary email of your tracking activity" },
    { key: "fraudAlerts",  label: "Fraud Alerts",  desc: "Alert when AI detects suspicious pricing" },
  ];

  return (
    <div className="animate-fadeUp max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display font-extrabold text-text text-2xl">Settings</h2>
        <p className="text-muted font-mono text-[10px] tracking-widest uppercase mt-1">Manage your account and preferences</p>
      </div>

      <Section title="Account">
        <Row label="Email" desc="Your login email">
          <span className="text-muted font-mono text-xs">{user?.email || "—"}</span>
        </Row>
        <Row label="Username" desc="Your public username">
          <span className="text-muted font-mono text-xs">{user?.name || "—"}</span>
        </Row>
        <Row label="Plan" desc="Current subscription tier">
          <span className="px-2 py-1 bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] tracking-widest rounded-sm">PRO</span>
        </Row>
      </Section>

      <Section title="Tracking Defaults">
        <Row label="Default Period" desc="Tracking window applied to new items">
          <div className="flex gap-2">
            {["30", "60", "90"].map(d => (
              <button
                key={d}
                onClick={() => setPeriod(d)}
                className={clsx(
                  "px-3 py-1.5 rounded-sm border font-mono text-[10px] tracking-widest transition-all",
                  period === d ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-accent/30"
                )}
              >
                {d}d
              </button>
            ))}
          </div>
        </Row>
      </Section>

      <Section title="Notifications">
        {notifItems.map(({ key, label, desc }) => (
          <Row key={key} label={label} desc={desc}>
            <Toggle
              enabled={notifs[key]}
              onChange={v => setNotifs(n => ({ ...n, [key]: v }))}
            />
          </Row>
        ))}
      </Section>

      <Section title="Danger Zone">
        <Row label="Delete Account" desc="Permanently delete your account and all data" danger>
          <button className="px-3 py-1.5 border border-danger/30 text-danger font-mono text-[10px] tracking-widest uppercase rounded-sm hover:bg-danger/10 transition-all">
            Delete
          </button>
        </Row>
      </Section>
    </div>
  );
}
