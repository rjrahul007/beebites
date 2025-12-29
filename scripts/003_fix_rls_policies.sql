-- Drop existing policies that cause infinite recursion
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

-- Create simplified admin policies that use direct auth.uid() checks
-- This avoids infinite recursion by checking profiles table only once

-- Admin can view all profiles
CREATE POLICY "admins_select_all_profiles" ON public.profiles FOR SELECT 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- Only admins can modify categories
CREATE POLICY "admins_insert_categories" ON public.categories FOR INSERT 
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "admins_update_categories" ON public.categories FOR UPDATE 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "admins_delete_categories" ON public.categories FOR DELETE 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- Admins can view all menu items
CREATE POLICY "admins_select_all_menu_items" ON public.menu_items FOR SELECT 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- Only admins can modify menu items
CREATE POLICY "admins_insert_menu_items" ON public.menu_items FOR INSERT 
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "admins_update_menu_items" ON public.menu_items FOR UPDATE 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "admins_delete_menu_items" ON public.menu_items FOR DELETE 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- Admins can view and update all orders
CREATE POLICY "admins_select_all_orders" ON public.orders FOR SELECT 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "admins_update_orders" ON public.orders FOR UPDATE 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- Admins can view all order items
CREATE POLICY "admins_select_all_order_items" ON public.order_items FOR SELECT 
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );
