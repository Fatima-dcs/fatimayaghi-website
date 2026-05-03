-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('coach', 'client')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  google_meet_url TEXT,
  summary TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- next_steps table
CREATE TABLE public.next_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- tools table
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  file_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_sessions_client_id ON public.sessions(client_id);
CREATE INDEX idx_sessions_session_date ON public.sessions(session_date DESC);
CREATE INDEX idx_next_steps_session_id ON public.next_steps(session_id);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.next_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Grant access to roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.sessions TO authenticated;
GRANT ALL ON public.next_steps TO authenticated;
GRANT ALL ON public.tools TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.next_steps TO service_role;
GRANT ALL ON public.tools TO service_role;

-- profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Coach can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'coach'));

-- sessions policies
CREATE POLICY "Client can view own sessions" ON public.sessions
  FOR SELECT TO authenticated USING (client_id = auth.uid());

CREATE POLICY "Coach can manage all sessions" ON public.sessions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'coach'));

-- next_steps policies
CREATE POLICY "Client can view own next_steps" ON public.next_steps
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.client_id = auth.uid()));

CREATE POLICY "Client can update own next_steps completion" ON public.next_steps
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.client_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.client_id = auth.uid()));

CREATE POLICY "Coach can manage all next_steps" ON public.next_steps
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'coach'));

-- tools policies
CREATE POLICY "Authenticated users can view tools" ON public.tools
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Coach can manage tools" ON public.tools
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'coach'));

-- Seed tools
INSERT INTO public.tools (name, name_ar, description, description_ar, file_url, category) VALUES
  ('Wheel of Life', 'عجلة الحياة', 'Assess balance across key life areas', 'قيّمي التوازن في مجالات حياتك الرئيسية', '/tools/wheel-of-life.pdf', 'assessment'),
  ('Tolerance List', 'قائمة التسامح', 'Identify what you are tolerating in your life', 'حدّدي ما تتحملينه في حياتك', '/tools/tolerance-list.pdf', 'reflection'),
  ('Vision Board Guide', 'دليل لوحة الرؤية', 'Create your vision for the future', 'أنشئي رؤيتك للمستقبل', '/tools/vision-board.pdf', 'planning');
