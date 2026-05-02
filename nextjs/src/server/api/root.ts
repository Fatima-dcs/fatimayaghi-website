import { router } from "@/server/trpc/init";
import { profileRouter } from "./routers/profile";
import { sessionsRouter } from "./routers/sessions";
import { nextStepsRouter } from "./routers/next-steps";
import { toolsRouter } from "./routers/tools";

export const appRouter = router({
  profile: profileRouter,
  sessions: sessionsRouter,
  nextSteps: nextStepsRouter,
  tools: toolsRouter,
});

export type AppRouter = typeof appRouter;
