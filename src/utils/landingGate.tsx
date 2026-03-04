
type LandingGateProps = {
  onSignIn: () => void;
};

export function LandingGate({ onSignIn }: LandingGateProps) {

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#00FF87 1px, transparent 1px), linear-gradient(90deg, #00FF87 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow blob */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg animate-fadeUp">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
            <span className="text-bg font-display font-black text-base">P</span>
          </div>
          <span className="font-display font-extrabold text-text text-2xl tracking-tight">PriceWatch</span>
        </div>

        <h1 className="font-display font-extrabold text-text text-4xl leading-tight mb-4">
          Track prices.<br />
          <span className="text-accent">Earn rebates.</span>
        </h1>
        <p className="text-muted font-mono text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Set your MSRP, choose a 30/60/90-day window, and let us find the best price. Guaranteed 10% savings or your money back.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["⚡ Live price tracking", "🤖 AI fraud detection", "💰 Automatic rebates", "📦 Drop-ship direct"].map((f) => (
            <span key={f} className="px-3 py-1.5 bg-surface border border-border rounded-sm font-mono text-[10px] text-muted tracking-widest">
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={onSignIn}
          className="px-10 py-4 bg-accent text-bg font-display font-extrabold text-sm tracking-widest uppercase rounded-sm hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          Get Started — Sign In →
        </button>
        <p className="text-muted font-mono text-[10px] mt-4 tracking-widest">No credit card required to sign up</p>
      </div>
    </div>
  );
}

