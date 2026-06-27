-- Drop the overly broad anon SELECT policy on client_invitations.
-- The validateToken tRPC procedure uses the service role (supabaseServer),
-- which bypasses RLS entirely, so this policy was unused while exposing
-- all prospect email addresses to anyone with the anon key.
DROP POLICY IF EXISTS "Anyone can validate token" ON public.client_invitations;
