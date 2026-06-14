-- Add lifecycle status to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS client_status TEXT
    CHECK (client_status IN ('prospect', 'invited', 'registered', 'inactive'))
    DEFAULT 'registered';

-- Invitations table
CREATE TABLE public.client_invitations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token       TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  email       TEXT NOT NULL,
  full_name   TEXT,
  created_by  UUID NOT NULL REFERENCES public.profiles(id),
  accepted_at TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  profile_id  UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON public.client_invitations(token);
CREATE INDEX idx_invitations_email ON public.client_invitations(email);

ALTER TABLE public.client_invitations ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.client_invitations TO authenticated;
GRANT ALL ON public.client_invitations TO service_role;

-- Coach can manage all invitations; anon can validate (SELECT) by token
CREATE POLICY "Coach manages invitations" ON public.client_invitations
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'coach'
  ));

CREATE POLICY "Anyone can validate token" ON public.client_invitations
  FOR SELECT TO anon, authenticated
  USING (true);

-- Rewrite handle_new_user to link invitations on registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  inv RECORD;
BEGIN
  INSERT INTO public.profiles (id, full_name, client_status)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'registered'
  );

  -- Link and accept any matching unexpired invitation
  SELECT * INTO inv
  FROM public.client_invitations
  WHERE email = NEW.email
    AND accepted_at IS NULL
    AND expires_at > NOW()
  LIMIT 1;

  IF FOUND THEN
    UPDATE public.client_invitations
    SET accepted_at = NOW(), profile_id = NEW.id
    WHERE id = inv.id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
