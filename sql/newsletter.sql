-- Table pour les abonnés à la newsletter
-- À exécuter dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_select_admin" ON public.newsletter_subscribers
  FOR SELECT USING (false); -- lecture uniquement via service_role
