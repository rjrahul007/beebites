-- 1) Create user_role enum (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('SUPER_ADMIN','ADMIN','KITCHEN','DELIVERY','CUSTOMER');
    END IF;
END$$;

-- 2) Add role column to profiles (if not exists) and migrate is_admin
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'CUSTOMER';
        -- Map existing boolean is_admin to role ADMIN
        UPDATE public.profiles SET role = 'ADMIN' WHERE is_admin IS TRUE;
    END IF;
END$$;

-- 3) Helper functions for role checks (security definer)
CREATE OR REPLACE FUNCTION public.has_role(p_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    r public.user_role;
BEGIN
    SELECT role INTO r FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(r::TEXT, '') = p_role;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    r public.user_role;
BEGIN
    SELECT role INTO r FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(r::TEXT, '') IN ('ADMIN','SUPER_ADMIN');
END;
$$;

-- Restrict direct execution by client roles; keep SECURITY DEFINER functions but revoke public execute.
REVOKE EXECUTE ON FUNCTION public.has_role(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;

-- 4) Create order_status enum (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM ('PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED');
    END IF;
END$$;

-- 4b) Safe conversion check: only attempt to convert orders.status (text) to order_status if
-- all distinct values (uppercased) are in the enum and column is not already of USER-DEFINED type.
-- DO $$
-- DECLARE
--   col_type TEXT;
--   typname TEXT;
--   mismatched_count INT;
--   incompatible_values TEXT;
--   current_default TEXT;
--   mapped_default TEXT := 'PENDING'; -- set NULL if you want no default
-- BEGIN
--   ------------------------------------------------------------------
--   -- 1) Ensure column exists
--   ------------------------------------------------------------------
--   SELECT format_type(atttypid, atttypmod)
--   INTO col_type
--   FROM pg_attribute
--   WHERE attrelid = 'public.orders'::regclass
--     AND attname = 'status'
--     AND NOT attisdropped;

--   IF col_type IS NULL THEN
--     RAISE NOTICE 'orders.status column not found; skipping.';
--     RETURN;
--   END IF;

--   ------------------------------------------------------------------
--   -- 2) Skip if already enum
--   ------------------------------------------------------------------
--   SELECT t.typname
--   INTO typname
--   FROM pg_attribute a
--   JOIN pg_type t ON a.atttypid = t.oid
--   WHERE a.attrelid = 'public.orders'::regclass
--     AND a.attname = 'status'
--     AND NOT a.attisdropped;

--   IF typname = 'order_status' THEN
--     RAISE NOTICE 'orders.status already type public.order_status; skipping.';
--     RETURN;
--   END IF;

--   ------------------------------------------------------------------
--   -- 3) Capture current default (if any)
--   ------------------------------------------------------------------
--   SELECT pg_get_expr(d.adbin, d.adrelid)
--   INTO current_default
--   FROM pg_attrdef d
--   JOIN pg_attribute a
--     ON a.attrelid = d.adrelid
--    AND a.attnum = d.adnum
--   WHERE d.adrelid = 'public.orders'::regclass
--     AND a.attname = 'status';

--   RAISE NOTICE 'Current default: %', COALESCE(current_default, '<none>');

--   ------------------------------------------------------------------
--   -- 4) Normalize data (TEXT → UPPERCASE)
--   ------------------------------------------------------------------
--   UPDATE public.orders
--   SET status = UPPER(status)
--   WHERE status IS NOT NULL;

--   ------------------------------------------------------------------
--   -- 5) Validate values against enum
--   ------------------------------------------------------------------
--   SELECT COUNT(*)
--   INTO mismatched_count
--   FROM (
--     SELECT DISTINCT status
--     FROM public.orders
--     WHERE status IS NOT NULL
--   ) s
--   WHERE status NOT IN (
--     'PENDING',
--     'CONFIRMED',
--     'PREPARING',
--     'OUT_FOR_DELIVERY',
--     'DELIVERED',
--     'CANCELLED'
--   );

--   IF mismatched_count > 0 THEN
--     SELECT string_agg(status, ', ' ORDER BY status)
--     INTO incompatible_values
--     FROM (
--       SELECT DISTINCT status
--       FROM public.orders
--       WHERE status IS NOT NULL
--         AND status NOT IN (
--           'PENDING',
--           'CONFIRMED',
--           'PREPARING',
--           'OUT_FOR_DELIVERY',
--           'DELIVERED',
--           'CANCELLED'
--         )
--     ) s;

--     RAISE EXCEPTION
--       'orders.status has invalid values (%). Fix them before enum conversion.',
--       incompatible_values;
--   END IF;

--   ------------------------------------------------------------------
--   -- 6) Drop default before type change
--   ------------------------------------------------------------------
--   IF current_default IS NOT NULL THEN
--     EXECUTE 'ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT';
--   END IF;

--   ------------------------------------------------------------------
--   -- 7) Convert column (SAFE CAST)
--   ------------------------------------------------------------------
--   EXECUTE '
--     ALTER TABLE public.orders
--     ALTER COLUMN status
--     TYPE public.order_status
--     USING status::public.order_status
--   ';

--   RAISE NOTICE 'orders.status successfully converted to public.order_status';

--   ------------------------------------------------------------------
--   -- 8) Restore default (optional)
--   ------------------------------------------------------------------
--   IF mapped_default IS NOT NULL THEN
--     EXECUTE format(
--       'ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT %L::public.order_status',
--       mapped_default
--     );
--   END IF;

-- EXCEPTION
--   WHEN others THEN
--     ----------------------------------------------------------------
--     -- Attempt to restore original default on failure
--     ----------------------------------------------------------------
--     IF current_default IS NOT NULL THEN
--       BEGIN
--         EXECUTE format(
--           'ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT %s',
--           current_default
--         );
--         RAISE NOTICE 'Restored original default after failure.';
--       EXCEPTION
--         WHEN others THEN
--           RAISE NOTICE 'Failed to restore default: %', SQLERRM;
--       END;
--     END IF;
--     RAISE;
-- END;
-- $$;

-- 5) Delivery assignments table (create if not exists), use existing uuid generator if present
-- Prefer existing function name: use extensions.uuid_generate_v4() if it exists; fallback to gen_random_uuid()
DO $$
DECLARE
  uuid_fn TEXT := 'gen_random_uuid()';
  fn_exists INT;
BEGIN
  SELECT COUNT(*) INTO fn_exists FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE p.proname = 'uuid_generate_v4';
  IF fn_exists > 0 THEN
    uuid_fn := 'extensions.uuid_generate_v4()';
  ELSE
    -- check pgcrypto
    SELECT COUNT(*) INTO fn_exists FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE p.proname = 'gen_random_uuid';
    IF fn_exists = 0 THEN
      RAISE NOTICE 'No known uuid generator found; please ensure one exists (pgcrypto or uuid-ossp). Using gen_random_uuid() may fail.';
    ELSE
      uuid_fn := 'gen_random_uuid()';
    END IF;
  END IF;

  EXECUTE format($q$
    CREATE TABLE IF NOT EXISTS public.delivery_assignments (
      id UUID PRIMARY KEY DEFAULT %s,
      order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
      delivery_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
      assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
      assigned_at TIMESTAMPTZ DEFAULT NOW(),
      cancelled BOOLEAN DEFAULT false,
      cancel_reason TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  $q$, uuid_fn);
END$$;

ALTER TABLE public.delivery_assignments ENABLE ROW LEVEL SECURITY;

-- RLS: delivery personnel can select their own assignments (limit to authenticated)
DROP POLICY IF EXISTS delivery_select_own
ON public.delivery_assignments;

CREATE POLICY delivery_select_own
ON public.delivery_assignments
FOR SELECT
TO authenticated
USING (delivery_id = auth.uid());

DROP POLICY IF EXISTS admins_manage_delivery_assignments
ON public.delivery_assignments;

CREATE POLICY admins_manage_delivery_assignments
ON public.delivery_assignments
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6) Audit logs table
DO $$
DECLARE
  uuid_fn TEXT := 'gen_random_uuid()';
  fn_exists INT;
BEGIN
  SELECT COUNT(*) INTO fn_exists FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE p.proname = 'uuid_generate_v4';
  IF fn_exists > 0 THEN
    uuid_fn := 'extensions.uuid_generate_v4()';
  ELSE
    SELECT COUNT(*) INTO fn_exists FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE p.proname = 'gen_random_uuid';
    IF fn_exists = 0 THEN
      RAISE NOTICE 'No known uuid generator found; please ensure one exists (pgcrypto or uuid-ossp).';
    ELSE
      uuid_fn := 'gen_random_uuid()';
    END IF;
  END IF;

  EXECUTE format($q$
    CREATE TABLE IF NOT EXISTS public.audit_logs (
      id UUID PRIMARY KEY DEFAULT %s,
      actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      resource_type TEXT,
      resource_id UUID,
      details JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  $q$, uuid_fn);
END$$;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only insert/select on audit_logs (TO authenticated)
DROP POLICY IF EXISTS admins_insert_audit_logs
ON public.audit_logs;

CREATE POLICY admins_insert_audit_logs
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS admins_select_audit_logs
ON public.audit_logs;

CREATE POLICY admins_select_audit_logs
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.is_admin());

-- 7) Order state machine function (idempotent replace)
CREATE OR REPLACE FUNCTION public.can_transition_order(old_status public.order_status, new_status public.order_status)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  IF old_status = 'PENDING'::public.order_status THEN
    RETURN new_status IN ('CONFIRMED'::public.order_status, 'CANCELLED'::public.order_status);
  ELSIF old_status = 'CONFIRMED'::public.order_status THEN
    RETURN new_status IN ('PREPARING'::public.order_status, 'CANCELLED'::public.order_status);
  ELSIF old_status = 'PREPARING'::public.order_status THEN
    RETURN new_status = 'OUT_FOR_DELIVERY'::public.order_status;
  ELSIF old_status = 'OUT_FOR_DELIVERY'::public.order_status THEN
    RETURN new_status IN ('DELIVERED'::public.order_status, 'CANCELLED'::public.order_status);
  ELSE
    RETURN false;
  END IF;
END;
$$;


REVOKE EXECUTE
ON FUNCTION public.can_transition_order(public.order_status, public.order_status)
FROM PUBLIC;

-- 8) Transition function (security definer)
CREATE OR REPLACE FUNCTION public.transition_order(
  p_order_id UUID,
  p_new_status public.order_status
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_old_status public.order_status;
  v_actor UUID := auth.uid();
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT status
  INTO v_old_status
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;

  IF NOT public.can_transition_order(v_old_status, p_new_status) THEN
    RAISE EXCEPTION 'Invalid transition: % → %', v_old_status, p_new_status;
  END IF;

  UPDATE public.orders
  SET status = p_new_status,
      updated_at = now()
  WHERE id = p_order_id;

  INSERT INTO public.audit_logs (
    actor_id, action, resource_type, resource_id, details
  )
  VALUES (
    v_actor,
    'transition_order',
    'orders',
    p_order_id,
    jsonb_build_object('from', v_old_status, 'to', p_new_status)
  );
END;
$$;

-- Restrict who can execute transition_order
GRANT EXECUTE
ON FUNCTION public.transition_order(UUID, public.order_status)
TO authenticated;


-- 9) Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders (status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items (category_id);
