CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value_en TEXT NOT NULL DEFAULT '',
  value_ar TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.site_content TO anon;
GRANT ALL ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

CREATE POLICY "Public can read content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Coach can manage content" ON public.site_content
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'coach'));

INSERT INTO public.site_content (key, value_en, value_ar) VALUES
  ('about_coach',
   'Completing my executive coaching training and working toward my ICF ACC certification, I bring evidence-based coaching tools to help you gain clarity, overcome obstacles, and move forward with confidence.',
   'أُكمل تدريبي في الكوتشينغ التنفيذي وأعمل على نيل شهادة ICF ACC، مقدِّمةً أدوات كوتشينغ مبنية على الأدلة لمساعدتك على اكتساب الوضوح وتجاوز العقبات والمضي قدمًا بثقة.'),
  ('about_it',
   'With years of experience as a Product Owner in tech, I also help non-IT people use AI tools and productivity hacks to work smarter — not harder.',
   'بفضل سنوات من خبرتي كمديرة منتجات في التقنية، أساعد غير المتخصصين على استخدام أدوات الذكاء الاصطناعي وتقنيات الإنتاجية للعمل بذكاء.'),
  ('why_arabic',
   '',
   'أنا فاطمة ياغي، من الجنوب اللبناني. رأيت بأم عيني كيف تتحمل المرأة اللبنانية أثقالاً لا تُحتمل — الحروب، الأزمات، والضغوط اليومية — وتبقى صامدة، لكنها في الداخل تبحث عن صوتها وعن حياة تستحقها.

هذا هو سبب رحلتي في الكوتشينغ. لأن كل امرأة تستحق مساحة آمنة تُسمع فيها، وأدوات حقيقية تساعدها على بناء مستقبلها بيدها. أنا هنا لأكون شريكتك في هذه الرحلة.');
