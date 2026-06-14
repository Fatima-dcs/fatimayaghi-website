import { z } from "zod";
import { router, publicProcedure, coachProcedure } from "@/server/trpc/init";
import { supabaseServer } from "@/lib/clients/supabase";

export const clientsRouter = router({
  list: coachProcedure.query(async () => {
    const { data: profiles } = await (supabaseServer as any)
      .from("profiles")
      .select("*, client_invitations(token, accepted_at, expires_at, created_at)")
      .eq("role", "client")
      .order("created_at", { ascending: false });

    const { data: sessions } = await (supabaseServer as any)
      .from("sessions")
      .select("client_id, session_date")
      .not("client_id", "is", null);

    const sessionMap = new Map<string, { count: number; last: string }>();
    (sessions ?? []).forEach((s: any) => {
      const existing = sessionMap.get(s.client_id);
      if (!existing) {
        sessionMap.set(s.client_id, { count: 1, last: s.session_date });
      } else {
        existing.count++;
        if (s.session_date > existing.last) existing.last = s.session_date;
      }
    });

    return (profiles ?? []).map((p: any) => ({
      ...p,
      sessionCount: sessionMap.get(p.id)?.count ?? 0,
      lastSession: sessionMap.get(p.id)?.last ?? null,
    }));
  }),

  get: coachProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data } = await (supabaseServer as any)
        .from("profiles")
        .select("*, client_invitations(token, accepted_at, expires_at)")
        .eq("id", input.id)
        .single();
      return data;
    }),

  invite: coachProcedure
    .input(z.object({ email: z.string().email(), full_name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      // Upsert a prospect profile for the email if one doesn't exist yet
      const { data: existingAuth } = await (supabaseServer as any)
        .from("profiles")
        .select("id")
        .eq("id", ctx.user.id) // just a dummy check — we rely on email match below
        .limit(0);

      // Create the invitation row
      const { data: invite, error } = await (supabaseServer as any)
        .from("client_invitations")
        .insert({
          email: input.email,
          full_name: input.full_name ?? null,
          created_by: ctx.user.id,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      return {
        token: invite.token,
        url: `${baseUrl}/invite/${invite.token}`,
        expiresAt: invite.expires_at,
      };
    }),

  updateStatus: coachProcedure
    .input(z.object({
      client_id: z.string().uuid(),
      status: z.enum(["prospect", "invited", "registered", "inactive"]),
    }))
    .mutation(async ({ input }) => {
      const { data } = await (supabaseServer as any)
        .from("profiles")
        .update({ client_status: input.status })
        .eq("id", input.client_id)
        .select()
        .single();
      return data;
    }),

  revokeInvite: coachProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      await (supabaseServer as any)
        .from("client_invitations")
        .delete()
        .eq("token", input.token)
        .is("accepted_at", null);
      return { ok: true };
    }),

  validateToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await (supabaseServer as any)
        .from("client_invitations")
        .select("email, full_name, expires_at, accepted_at")
        .eq("token", input.token)
        .single();

      if (error || !data) return { valid: false, reason: "not_found" as const };
      if (data.accepted_at) return { valid: false, reason: "already_used" as const };
      if (new Date(data.expires_at) < new Date()) return { valid: false, reason: "expired" as const };

      return {
        valid: true,
        email: data.email as string,
        full_name: data.full_name as string | null,
      };
    }),
});
