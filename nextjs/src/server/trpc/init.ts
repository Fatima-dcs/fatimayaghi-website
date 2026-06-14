import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const isCoach = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  const { data } = await (await import("@/lib/clients/supabase")).supabaseServer
    .from("profiles" as any)
    .select("role")
    .eq("id", ctx.user.id)
    .single();
  if ((data as any)?.role !== "coach") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const coachProcedure = t.procedure.use(isAuthed).use(isCoach);
