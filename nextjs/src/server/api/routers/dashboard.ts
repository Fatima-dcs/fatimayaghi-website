import { router } from "@/server/trpc/init";
import { twitterRouter } from "./dashboard/twitter";

// Dashboard API
export const dashboardRouter = router({
  twitter: twitterRouter,
}); 
