import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { appConfig } from "@/config/app";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  const inviteToken = router.query.invite as string | undefined;
  const prefillEmail = router.query.email as string | undefined;
  const prefillName = router.query.name as string | undefined;

  const hasValidInvite = !!inviteToken;

  const [email, setEmail] = useState(prefillEmail ?? "");
  const [fullName, setFullName] = useState(prefillName ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Sync prefills once query params are available
  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
    if (prefillName) setFullName(prefillName);
  }, [prefillEmail, prefillName]);

  // Redirect already-signed-in users
  useEffect(() => {
    if (user && !userLoading) {
      router.push("/dashboard");
    }
  }, [user, userLoading, router]);

  // Block public sign-up unless coming from a valid invite link
  if (!appConfig.auth.enableSignUp && !hasValidInvite) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--sand-bg)" }}>
        <div
          className="w-full max-w-sm rounded-3xl p-10 text-center space-y-4"
          style={{ background: "var(--sand-surface)" }}
        >
          <h2 className="text-2xl font-medium font-heading" style={{ color: "var(--sand-ink)" }}>
            Registration is by invite only
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
            Ask your coach for an invite link to create your account.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full rounded-full py-3 text-sm font-medium transition hover:-translate-y-0.5"
            style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || undefined,
          invite_token: inviteToken ?? undefined,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      toast({ title: "Welcome!", description: "Your account has been created." });
      router.push("/dashboard");
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: "var(--sand-bg)" }}>
      <div
        className="w-full max-w-sm rounded-3xl p-10 space-y-6"
        style={{ background: "var(--sand-surface)" }}
      >
        {hasValidInvite && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: "var(--sand-bg)", color: "var(--sand-ink-soft)" }}
          >
            Creating your account for <span className="font-medium" style={{ color: "var(--sand-ink)" }}>{email}</span>
          </div>
        )}

        <h2 className="text-2xl font-medium font-heading" style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}>
          Create account
        </h2>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--sand-ink-soft)" }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink)", background: "var(--sand-bg)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--sand-ink-soft)" }}>
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              readOnly={hasValidInvite}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{
                borderColor: "var(--sand-muted)",
                color: "var(--sand-ink)",
                background: hasValidInvite ? "var(--sand-surface)" : "var(--sand-bg)",
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--sand-ink-soft)" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{ borderColor: "var(--sand-muted)", color: "var(--sand-ink)", background: "var(--sand-bg)" }}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-full py-3 text-sm font-medium transition hover:-translate-y-0.5"
            style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
          >
            Create account
          </button>
        </form>

        <p className="text-center text-xs" style={{ color: "var(--sand-ink-soft)" }}>
          Already have an account?{" "}
          <Link href="/sign-in" className="underline hover:opacity-70" style={{ color: "var(--sand-accent)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
