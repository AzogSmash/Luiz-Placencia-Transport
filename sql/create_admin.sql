-- ═══════════════════════════════════════════════════════════════
--  À exécuter dans Supabase > SQL Editor (en una sola vez)
--  Si ya ejecutaste una versión anterior, los ALTER TABLE
--  añadirán las columnas que falten sin romper nada.
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────
--  1. Crear la tabla profiles (instalación limpia)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id                 UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              TEXT,
  role               TEXT        NOT NULL DEFAULT 'user',
  full_name          TEXT,
  phone              TEXT,
  address            TEXT,
  preferred_language TEXT                 DEFAULT 'es',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Si la tabla ya existe, añadir las columnas nuevas
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name          TEXT,
  ADD COLUMN IF NOT EXISTS phone              TEXT,
  ADD COLUMN IF NOT EXISTS address            TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'es';


-- ─────────────────────────────────────────────────────────────
--  2. Row Level Security
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- El panel /admin usa la clave service_role (createAdminClient) que
-- omite RLS — no se necesita ninguna política adicional para admin.


-- ─────────────────────────────────────────────────────────────
--  3. Trigger — crear perfil automáticamente al registrarse
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────────────
--  4. Backfill — añadir usuarios ya existentes
-- ─────────────────────────────────────────────────────────────

INSERT INTO public.profiles (id, email, role, full_name)
SELECT
  id,
  email,
  'user',
  raw_user_meta_data->>'full_name'
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
--  5. Promocionar sebcasse9@gmail.com como admin
-- ─────────────────────────────────────────────────────────────

UPDATE public.profiles
SET    role = 'admin'
WHERE  id = (SELECT id FROM auth.users WHERE email = 'sebcasse9@gmail.com');


-- ─────────────────────────────────────────────────────────────
--  6. Verificación
-- ─────────────────────────────────────────────────────────────

SELECT p.id, p.role, p.email, p.full_name, p.created_at
FROM   public.profiles p
WHERE  p.email = 'sebcasse9@gmail.com';
