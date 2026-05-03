import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/clients/supabase";

export const config = { api: { bodyParser: false } };

async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (secret && req.query.secret !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let rawBody: string;
  try {
    rawBody = await getRawBody(req);
  } catch (e) {
    console.error("[calendly webhook] failed to read body:", e);
    return res.status(500).json({ error: "Failed to read body" });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  console.log("[calendly webhook] event:", payload.event, "payload keys:", Object.keys(payload.payload ?? {}));

  try {
    const event = payload.event;

    if (event === "invitee.created") {
      const invitee = payload.payload;
      const scheduledEvent = invitee?.scheduled_event;

      const calendlyUri = invitee?.uri as string;
      const inviteeEmail = invitee?.email as string;
      const inviteeName = invitee?.name as string;
      const title = (typeof scheduledEvent === "object" ? scheduledEvent?.name : null) ?? "Coaching Session";
      const sessionDate = typeof scheduledEvent === "object" ? (scheduledEvent?.start_time as string) : undefined;
      const endTime = typeof scheduledEvent === "object" ? (scheduledEvent?.end_time as string) : undefined;
      const googleMeetUrl = typeof scheduledEvent === "object" ? (scheduledEvent?.location?.join_url as string | undefined) : undefined;
      const coachId = process.env.COACH_USER_ID;

      console.log("[calendly webhook] invitee:", { calendlyUri, inviteeEmail, inviteeName, title, sessionDate, coachId });

      if (!coachId) {
        console.error("[calendly webhook] COACH_USER_ID env var not set");
        return res.status(500).json({ error: "Server misconfigured" });
      }

      const durationMinutes = sessionDate && endTime
        ? Math.round((new Date(endTime).getTime() - new Date(sessionDate).getTime()) / 60000)
        : 60;

      // Look up client by email via admin API
      let clientId: string | null = null;
      try {
        const { data: adminData, error: adminError } = await supabaseServer.auth.admin.listUsers();
        if (adminError) {
          console.error("[calendly webhook] admin.listUsers error:", adminError);
        } else {
          const matchedUser = adminData?.users?.find((u) => u.email === inviteeEmail);
          clientId = matchedUser?.id ?? null;
          console.log("[calendly webhook] matched client_id:", clientId);
        }
      } catch (e) {
        console.error("[calendly webhook] failed to look up user:", e);
      }

      const { error } = await (supabaseServer as any).from("sessions").insert({
        title,
        session_date: sessionDate ?? new Date().toISOString(),
        duration_minutes: durationMinutes,
        google_meet_url: googleMeetUrl ?? null,
        status: "scheduled",
        coach_id: coachId,
        client_id: clientId,
        invitee_email: inviteeEmail,
        invitee_name: inviteeName,
        calendly_uri: calendlyUri,
      });

      console.log("[calendly webhook] insert result error:", error);

      if (error?.code === "23505") return res.status(200).json({ ok: true, duplicate: true });
      if (error) return res.status(500).json({ error: error.message });
    }

    if (event === "invitee.canceled") {
      const calendlyUri = payload.payload?.uri as string;
      console.log("[calendly webhook] canceling session with uri:", calendlyUri);
      await (supabaseServer as any)
        .from("sessions")
        .update({ status: "cancelled" })
        .eq("calendly_uri", calendlyUri);
    }
  } catch (e: any) {
    console.error("[calendly webhook] unhandled error:", e?.message ?? e);
    return res.status(500).json({ error: "Internal server error" });
  }

  return res.status(200).json({ ok: true });
}
