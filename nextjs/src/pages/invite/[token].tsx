import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "@/utils/api";

export default function InvitePage() {
  const router = useRouter();
  const token = router.query.token as string;

  const { data, isLoading } = api.clients.validateToken.useQuery(
    { token },
    { enabled: !!token }
  );

  if (isLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sand-bg)" }}>
        <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: "var(--sand-muted)" }} />
      </div>
    );
  }

  if (!data?.valid) {
    const messages: Record<string, string> = {
      not_found:    "This invite link is invalid or doesn't exist.",
      already_used: "This invite link has already been used.",
      expired:      "This invite link has expired. Ask your coach to send a new one.",
    };
    const reason = ((data as any)?.reason as string) ?? "not_found";

    return (
      <>
        <Head><title>Invalid Invite — Fatima Yaghi Coaching</title></Head>
        <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--sand-bg)" }}>
          <div className="max-w-sm w-full text-center space-y-4">
            <p className="text-4xl">🔗</p>
            <h1 className="text-2xl font-medium font-heading" style={{ color: "var(--sand-ink)" }}>
              Link unavailable
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
              {messages[reason]}
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-sm underline hover:opacity-70"
              style={{ color: "var(--sand-accent)" }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const validData = data as { valid: true; email: string; full_name: string | null };
  const name = validData.full_name ?? "";
  const signUpUrl = `/sign-up?invite=${token}&email=${encodeURIComponent(validData.email)}${name ? `&name=${encodeURIComponent(name)}` : ""}`;

  return (
    <>
      <Head><title>You're invited — Fatima Yaghi Coaching</title></Head>
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--sand-bg)" }}>
        <div
          className="max-w-sm w-full rounded-3xl p-10 space-y-6"
          style={{ background: "var(--sand-surface)" }}
        >
          <div
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--sand-accent)",
            }}
          >
            You're invited
          </div>

          <h1 className="text-3xl font-medium font-heading" style={{ color: "var(--sand-ink)", letterSpacing: "-0.02em" }}>
            {validData.full_name ? `Welcome, ${validData.full_name.split(" ")[0]}.` : "Welcome."}
          </h1>

          <p className="text-sm leading-relaxed" style={{ color: "var(--sand-ink-soft)" }}>
            Fatima Yaghi has invited you to access your personal coaching portal — where you can view your sessions, notes, and progress in one place.
          </p>

          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: "var(--sand-bg)", color: "var(--sand-ink-soft)" }}
          >
            <span className="font-medium" style={{ color: "var(--sand-ink)" }}>Registering as: </span>
            {validData.email}
          </div>

          <Link
            href={signUpUrl}
            className="block w-full text-center rounded-full py-3 text-sm font-medium transition hover:-translate-y-0.5"
            style={{ background: "var(--sand-accent)", color: "var(--sand-bg)" }}
          >
            Create my account
          </Link>

          <p className="text-xs text-center" style={{ color: "var(--sand-muted)" }}>
            Already have an account?{" "}
            <Link href="/sign-in" className="underline hover:opacity-70">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
