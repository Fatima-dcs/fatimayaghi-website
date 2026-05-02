import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";

export const sessionsRouter = router({
  list: protectedProcedure
    .input(z.object({ client_id: z.string().uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { data: profile } = await ctx.supabase
        .from("profiles")
        .select("role")
        .eq("id", ctx.user.id)
        .single();

      let query = ctx.supabase
        .from("sessions")
        .select("*, next_steps(*)")
        .order("session_date", { ascending: false });

      if (profile?.role !== "coach") {
        query = query.eq("client_id", ctx.user.id);
      } else if (input?.client_id) {
        query = query.eq("client_id", input.client_id);
      }

      const { data } = await query;
      return data ?? [];
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data } = await ctx.supabase
        .from("sessions")
        .select("*, next_steps(*)")
        .eq("id", input.id)
        .single();
      return data;
    }),

  create: protectedProcedure
    .input(
      z.object({
        client_id: z.string().uuid(),
        title: z.string().min(1),
        session_date: z.string(),
        duration_minutes: z.number().default(60),
        google_meet_url: z.string().url().optional().or(z.literal("")),
        summary: z.string().optional(),
        status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data: profile } = await ctx.supabase
        .from("profiles")
        .select("role")
        .eq("id", ctx.user.id)
        .single();
      if (profile?.role !== "coach") throw new TRPCError({ code: "FORBIDDEN" });

      const { data } = await ctx.supabase
        .from("sessions")
        .insert({ ...input, coach_id: ctx.user.id })
        .select()
        .single();
      return data;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).optional(),
        session_date: z.string().optional(),
        duration_minutes: z.number().optional(),
        google_meet_url: z.string().optional().nullable(),
        summary: z.string().optional().nullable(),
        status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data: profile } = await ctx.supabase
        .from("profiles")
        .select("role")
        .eq("id", ctx.user.id)
        .single();
      if (profile?.role !== "coach") throw new TRPCError({ code: "FORBIDDEN" });

      const { id, ...rest } = input;
      const { data } = await ctx.supabase
        .from("sessions")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
      return data;
    }),
});
