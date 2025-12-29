-- Complete fix for infinite recursion by using security definer function

-- Create a security definer function to check admin status
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT is_admin FROM public.profiles WHERE id = auth.uid());
END;
$$;

-- Drop all existing admin policies
DROP POLICY IF EXISTS "admins_select_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admins_insert_categories" ON public.categories;
DROP POLICY IF EXISTS "admins_update_categories" ON public.categories;
DROP POLICY IF EXISTS "admins_delete_categories" ON public.categories;
DROP POLICY IF EXISTS "admins_select_all_menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "admins_insert_menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "admins_update_menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "admins_delete_menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "admins_select_all_orders" ON public.orders;
DROP POLICY IF EXISTS "admins_update_orders" ON public.orders;
DROP POLICY IF EXISTS "admins_select_all_order_items" ON public.order_items;

-- Recreate admin policies using the security definer function
-- Admin can view all profiles
CREATE POLICY "admins_select_all_profiles" ON public.profiles FOR SELECT 
  USING (public.is_admin() = true);

-- Only admins can modify categories
CREATE POLICY "admins_insert_categories" ON public.categories FOR INSERT 
  WITH CHECK (public.is_admin() = true);

CREATE POLICY "admins_update_categories" ON public.categories FOR UPDATE 
  USING (public.is_admin() = true);

CREATE POLICY "admins_delete_categories" ON public.categories FOR DELETE 
  USING (public.is_admin() = true);

-- Admins can view all menu items
CREATE POLICY "admins_select_all_menu_items" ON public.menu_items FOR SELECT 
  USING (public.is_admin() = true);

-- Only admins can modify menu items
CREATE POLICY "admins_insert_menu_items" ON public.menu_items FOR INSERT 
  WITH CHECK (public.is_admin() = true);

CREATE POLICY "admins_update_menu_items" ON public.menu_items FOR UPDATE 
  USING (public.is_admin() = true);

CREATE POLICY "admins_delete_menu_items" ON public.menu_items FOR DELETE 
  USING (public.is_admin() = true);

-- Admins can view and update all orders
CREATE POLICY "admins_select_all_orders" ON public.orders FOR SELECT 
  USING (public.is_admin() = true);

CREATE POLICY "admins_update_orders" ON public.orders FOR UPDATE 
  USING (public.is_admin() = true);

-- Admins can view all order items
CREATE POLICY "admins_select_all_order_items" ON public.order_items FOR SELECT 
  USING (public.is_admin() = true);
