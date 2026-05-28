import { useState } from "react";

interface Props {
  roomId: string;
  onJoin: (displayName: string) => Promise<void> | void;
}

export function JoinModal({ roomId, onJoin }: Props) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onJoin(name.trim());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-hero">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md mx-4 rounded-3xl border border-border/60 bg-card/80 backdrop-blur p-5 sm:p-8 glow-mint"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block size-2 rounded-full bg-mint shadow-[0_0_10px_var(--mint)]" />
          Room <span className="font-mono">{roomId.slice(0, 8)}</span> is live
        </div>
        <h2 className="mt-3 text-3xl font-bold">Pick a display name</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Other listeners will see this name. No signup, no email.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={32}
          placeholder="e.g. Nova"
          className="mt-6 w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-mint focus:ring-2 focus:ring-mint/30 transition"
        />
        <button
          type="submit"
          disabled={!name.trim() || busy}
          className="mt-5 w-full rounded-xl bg-mint py-3 font-semibold text-primary-foreground transition hover:scale-[1.01] disabled:opacity-50"
        >
          {busy ? "Joining…" : "Step into the room"}
        </button>
      </form>
    </div>
  );
}
