-- ============================================================
-- Table : reservations
-- Projet : Luiz Placencia Transport
-- Exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reservations (
  id                BIGSERIAL       PRIMARY KEY,
  nom               TEXT            NOT NULL,
  telephone         TEXT            NOT NULL,
  email             TEXT            NOT NULL,
  adresse_depart    TEXT            NOT NULL,
  adresse_arrivee   TEXT            NOT NULL,
  date_heure        TIMESTAMPTZ     NOT NULL,
  nombre_passagers  INTEGER         NOT NULL DEFAULT 1,
  message           TEXT,
  statut            TEXT            NOT NULL DEFAULT 'en attente',
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Index pour filtrer rapidement par statut (usage admin)
CREATE INDEX IF NOT EXISTS reservations_statut_idx ON public.reservations (statut);
CREATE INDEX IF NOT EXISTS reservations_created_at_idx ON public.reservations (created_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Tout visiteur anonyme peut créer une réservation (formulaire public)
CREATE POLICY "anon_can_insert" ON public.reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Seuls les utilisateurs authentifiés (admin) peuvent lire et modifier
CREATE POLICY "auth_can_select" ON public.reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_can_update" ON public.reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
