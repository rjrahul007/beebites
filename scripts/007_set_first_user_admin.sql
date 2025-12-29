-- Make the first registered user an admin
-- This script is helpful for setting up the first admin user automatically

UPDATE profiles
SET is_admin = true
WHERE id = (
  SELECT id FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1
);

-- Verify the admin was set
SELECT 
  p.id,
  u.email,
  p.full_name,
  p.is_admin,
  u.created_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.is_admin = true;
