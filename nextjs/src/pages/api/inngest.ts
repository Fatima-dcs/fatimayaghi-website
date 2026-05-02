import { inngestClient } from "@/lib/clients/inngest";
import { serve } from "inngest/next";

export const config = {
  maxDuration: 720,
};

export default serve({
  client: inngestClient,
  functions: [],
});
