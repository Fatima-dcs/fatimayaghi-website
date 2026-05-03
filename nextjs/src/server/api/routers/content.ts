import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc/init";
import { supabaseServer } from "@/lib/clients/supabase";
import { TRPCError } from "@trpc/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseServer as any;

export const contentRouter = router({
  list: publicProcedure.query(async () => {
    const { data } = await db.from("site_content").select("*");
    const map: Record<string, { value_en: string; value_ar: string }> = {};
    for (const row of (data ?? []) as { key: string; value_en: string; value_ar: string }[]) {
      map[row.key] = { value_en: row.value_en, value_ar: row.value_ar };
    }
    return map;
  }),

  update: protectedProcedure
    .input(z.object({
      key: z.string(),
      value_en: z.string(),
      value_ar: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: profile } = await ctx.supabase
        .from("profiles")
        .select("role")
        .eq("id", ctx.user.id)
        .single();

      if ((profile as any)?.role !== "coach") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { data } = await db
        .from("site_content")
        .upsert({ key: input.key, value_en: input.value_en, value_ar: input.value_ar, updated_at: new Date().toISOString() })
        .select()
        .single();

      return data;
    }),
});
