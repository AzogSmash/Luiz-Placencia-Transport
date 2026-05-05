-- Table pour stocker les messages du formulaire de contact
-- À exécuter dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         BIGSERIAL PRIMARY KEY,
  nombre     TEXT NOT NULL,
  email      TEXT NOT NULL,
  mensaje    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seul le service_role (admin) peut lire les messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_insert_public" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_select_admin" ON public.contact_messages
  FOR SELECT USING (false); -- lecture uniquement via service_role (bypasse RLS)
