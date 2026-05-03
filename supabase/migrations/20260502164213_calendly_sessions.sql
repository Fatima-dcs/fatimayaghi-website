ALTER TABLE public.sessions ALTER COLUMN client_id DROP NOT NULL;
ALTER TABLE public.sessions ADD COLUMN invitee_email TEXT;
ALTER TABLE public.sessions ADD COLUMN invitee_name  TEXT;
ALTER TABLE public.sessions ADD COLUMN calendly_uri  TEXT UNIQUE;

GRANT ALL ON public.sessions TO service_role;
