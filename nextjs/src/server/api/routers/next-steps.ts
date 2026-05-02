import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";

export const nextStepsRouter = router({
  toggleComplete: protectedProcedure
    .input(z.object({ id: z.string().uuid(), is_completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { data } = await ctx.supabase
        .from("next_steps")
        .update({ is_completed: input.is_completed })
        .eq("id", input.id)
        .select()
        .single();
      return data;
    }),

  create: protectedProcedure
    .input(
      z.object({
        session_id: z.string().uuid(),
        description: z.string().min(1),
        due_date: z.string().optional().nullable(),
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
        .from("next_steps")
        .insert(input)
        .select()
        .single();
      return data;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data: profile } = await ctx.supabase
        .from("profiles")
        .select("role")
        .eq("id", ctx.user.id)
        .single();
      if (profile?.role !== "coach") throw new TRPCError({ code: "FORBIDDEN" });

      await ctx.supabase.from("next_steps").delete().eq("id", input.id);
      return { success: true };
    }),
});
