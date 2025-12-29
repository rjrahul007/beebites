-- Insert categories
INSERT INTO public.categories (name, slug, image_url, display_order) VALUES
  ('Pizza', 'pizza', '/placeholder.svg?height=200&width=200', 1),
  ('Burgers', 'burgers', '/placeholder.svg?height=200&width=200', 2),
  ('Fried Chicken', 'fried-chicken', '/placeholder.svg?height=200&width=200', 3),
  ('Sides', 'sides', '/placeholder.svg?height=200&width=200', 4),
  ('Desserts', 'desserts', '/placeholder.svg?height=200&width=200', 5),
  ('Beverages', 'beverages', '/placeholder.svg?height=200&width=200', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert menu items for Pizza
INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories) 
SELECT 
  'Margherita Pizza',
  'Classic pizza with tomato sauce, mozzarella, and fresh basil',
  299.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  25,
  850
FROM public.categories WHERE slug = 'pizza';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Pepperoni Pizza',
  'Loaded with pepperoni and extra cheese',
  399.00,
  id,
  '/placeholder.svg?height=300&width=300',
  false,
  25,
  950
FROM public.categories WHERE slug = 'pizza';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'BBQ Chicken Pizza',
  'BBQ sauce base with grilled chicken and onions',
  449.00,
  id,
  '/placeholder.svg?height=300&width=300',
  false,
  30,
  1050
FROM public.categories WHERE slug = 'pizza';

-- Insert menu items for Burgers
INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Classic Beef Burger',
  'Juicy beef patty with lettuce, tomato, and special sauce',
  199.00,
  id,
  '/placeholder.svg?height=300&width=300',
  false,
  15,
  650
FROM public.categories WHERE slug = 'burgers';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Chicken Burger',
  'Crispy chicken fillet with mayo and lettuce',
  179.00,
  id,
  '/placeholder.svg?height=300&width=300',
  false,
  15,
  580
FROM public.categories WHERE slug = 'burgers';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Veggie Burger',
  'Plant-based patty with fresh vegetables',
  159.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  12,
  450
FROM public.categories WHERE slug = 'burgers';

-- Insert menu items for Fried Chicken
INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  '4 Piece Chicken',
  'Four pieces of crispy fried chicken',
  249.00,
  id,
  '/placeholder.svg?height=300&width=300',
  false,
  18,
  920
FROM public.categories WHERE slug = 'fried-chicken';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  '8 Piece Chicken Bucket',
  'Eight pieces of our signature fried chicken',
  449.00,
  id,
  '/placeholder.svg?height=300&width=300',
  false,
  20,
  1840
FROM public.categories WHERE slug = 'fried-chicken';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Chicken Wings (6 pcs)',
  'Spicy chicken wings with your choice of sauce',
  199.00,
  id,
  '/placeholder.svg?height=300&width=300',
  false,
  15,
  540
FROM public.categories WHERE slug = 'fried-chicken';

-- Insert menu items for Sides
INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'French Fries',
  'Crispy golden fries with salt',
  99.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  8,
  320
FROM public.categories WHERE slug = 'sides';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Onion Rings',
  'Crispy battered onion rings',
  119.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  10,
  380
FROM public.categories WHERE slug = 'sides';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Mozzarella Sticks',
  'Cheesy mozzarella sticks with marinara sauce',
  149.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  12,
  420
FROM public.categories WHERE slug = 'sides';

-- Insert menu items for Desserts
INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Chocolate Brownie',
  'Warm chocolate brownie with vanilla ice cream',
  129.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  10,
  480
FROM public.categories WHERE slug = 'desserts';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Ice Cream Sundae',
  'Vanilla ice cream with chocolate sauce and nuts',
  99.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  5,
  350
FROM public.categories WHERE slug = 'desserts';

-- Insert menu items for Beverages
INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Coca Cola',
  'Chilled Coca Cola (500ml)',
  49.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  2,
  210
FROM public.categories WHERE slug = 'beverages';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Fresh Lemonade',
  'Freshly squeezed lemonade',
  69.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  5,
  120
FROM public.categories WHERE slug = 'beverages';

INSERT INTO public.menu_items (name, description, price, category_id, image_url, is_vegetarian, preparation_time, calories)
SELECT 
  'Mango Smoothie',
  'Creamy mango smoothie',
  99.00,
  id,
  '/placeholder.svg?height=300&width=300',
  true,
  5,
  180
FROM public.categories WHERE slug = 'beverages';
