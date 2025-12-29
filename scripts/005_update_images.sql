-- Update all menu items and categories with better image queries for more realistic food images

UPDATE public.categories SET image_url = 
  CASE 
    WHEN slug = 'pizza' THEN '/placeholder.svg?height=200&width=200'
    WHEN slug = 'burgers' THEN '/placeholder.svg?height=200&width=200'
    WHEN slug = 'fried-chicken' THEN '/placeholder.svg?height=200&width=200'
    WHEN slug = 'sides' THEN '/placeholder.svg?height=200&width=200'
    WHEN slug = 'desserts' THEN '/placeholder.svg?height=200&width=200'
    WHEN slug = 'beverages' THEN '/placeholder.svg?height=200&width=200'
  END
WHERE slug IN ('pizza', 'burgers', 'fried-chicken', 'sides', 'desserts', 'beverages');

UPDATE public.menu_items SET image_url = 
  CASE 
    WHEN name = 'Margherita Pizza' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Pepperoni Pizza' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'BBQ Chicken Pizza' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Classic Beef Burger' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Chicken Burger' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Veggie Burger' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = '4 Piece Chicken' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = '8 Piece Chicken Bucket' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Chicken Wings (6 pcs)' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'French Fries' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Onion Rings' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Mozzarella Sticks' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Chocolate Brownie' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Ice Cream Sundae' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Coca Cola' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Fresh Lemonade' THEN '/placeholder.svg?height=300&width=300'
    WHEN name = 'Mango Smoothie' THEN '/placeholder.svg?height=300&width=300'
    ELSE image_url
  END;
