import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc/init";

export const profileRouter = router({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.supabase
      .from("profiles")
      .select("*")
      .eq("id", ctx.user.id)
      .single();
    return data;
  }),

  updateMe: protectedProcedure
    .input(z.object({ full_name: z.string().optional(), phone: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { data } = await ctx.supabase
        .from("profiles")
        .update(input)
        .eq("id", ctx.user.id)
        .select()
        .single();
      return data;
    }),
});
