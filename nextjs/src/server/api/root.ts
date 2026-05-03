import { router } from "@/server/trpc/init";
import { profileRouter } from "./routers/profile";
import { sessionsRouter } from "./routers/sessions";
import { nextStepsRouter } from "./routers/next-steps";
import { toolsRouter } from "./routers/tools";
import { contentRouter } from "./routers/content";

export const appRouter = router({
  profile: profileRouter,
  sessions: sessionsRouter,
  nextSteps: nextStepsRouter,
  tools: toolsRouter,
  content: contentRouter,
});

export type AppRouter = typeof appRouter;
