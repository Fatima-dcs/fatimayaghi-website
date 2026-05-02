import { router, protectedProcedure } from "@/server/trpc/init";

export const toolsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: true });
    return data ?? [];
  }),
});
