-- ============================================================
-- Migration : ajout de user_id et mise à jour des politiques RLS
-- Exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Ajouter la colonne user_id (nullable pour les réservations invités)
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS reservations_user_id_idx ON public.reservations (user_id);

-- 2. Supprimer les anciennes politiques trop permissives
DROP POLICY IF EXISTS "auth_can_select" ON public.reservations;
DROP POLICY IF EXISTS "auth_can_update" ON public.reservations;

-- 3. Chaque utilisateur peut voir uniquement ses propres réservations
CREATE POLICY "users_select_own" ON public.reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Un utilisateur peut annuler ses propres réservations "en attente"
CREATE POLICY "users_update_own" ON public.reservations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
