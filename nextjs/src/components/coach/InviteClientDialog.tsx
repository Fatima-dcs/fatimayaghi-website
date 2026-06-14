import { useState } from "react";
import { api } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function InviteClientDialog({ onInvited }: { onInvited?: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [result, setResult] = useState<{ url: string; expiresAt: string } | null>(null);
  const { toast } = useToast();

  const invite = api.clients.invite.useMutation({
    onSuccess(data) {
      setResult({ url: data.url, expiresAt: data.expiresAt });
      onInvited?.();
    },
    onError(err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    invite.mutate({ email, full_name: fullName || undefined });
  }

  function copyLink() {
    if (!result) return;
    navigator.clipboard.writeText(result.url);
    toast({ title: "Copied!", description: "Invite link copied to clipboard." });
  }

  function handleClose() {
    setOpen(false);
    setEmail("");
    setFullName("");
    setResult(null);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full px-5 text-sm font-medium"
          style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
        >
          + Invite Client
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a client</DialogTitle>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--sand-ink)" }}>
                Full name <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sara Khalil"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--sand-ink)" }}>
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink)" }}
              />
            </div>
            <Button
              type="submit"
              disabled={invite.isPending}
              className="w-full rounded-full"
              style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
            >
              {invite.isPending ? "Generating…" : "Generate invite link"}
            </Button>
          </form>
        ) : (
          <div className="mt-2 space-y-4">
            <p className="text-sm" style={{ color: "var(--sand-ink-soft)" }}>
              Share this link with your client. It expires in 7 days.
            </p>
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: "var(--sand-muted)", background: "var(--sand-surface)" }}
            >
              <span className="flex-1 truncate text-sm font-mono" style={{ color: "var(--sand-ink)" }}>
                {result.url}
              </span>
              <button
                onClick={copyLink}
                className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition hover:opacity-70"
                style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
              >
                Copy
              </button>
            </div>
            <p className="text-xs" style={{ color: "var(--sand-muted)" }}>
              Expires: {new Date(result.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <Button variant="outline" className="w-full rounded-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
