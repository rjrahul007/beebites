# Admin Panel Access Guide

## Overview

This application includes a secure admin dashboard for managing orders and viewing customer information. Admin access must be granted at the database level for security.

## How to Access the Admin Panel

### Method 1: Make Yourself Admin (Recommended for Initial Setup)

1. **Sign Up / Log In**

   - Create an account or log in to the application
   - Note your email address

2. **Access Supabase Dashboard**

   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project dashboard

3. **Open SQL Editor**

   - In the left sidebar, click on "SQL Editor"

4. **Run SQL Command**
   Replace `your-email@example.com` with your actual email. Prefer setting `role = 'ADMIN'`; legacy `is_admin` boolean is also supported during migration:

   ```sql
   -- Preferred: set role enum to ADMIN
   UPDATE profiles
   SET role = 'ADMIN'
   WHERE id = (
      SELECT id FROM auth.users
      WHERE email = 'your-email@example.com'
   );

   -- (Optional, legacy) set is_admin = true for compatibility
   UPDATE profiles
   SET is_admin = true
   WHERE id = (
      SELECT id FROM auth.users
      WHERE email = 'your-email@example.com'
   );
   ```

5. **Access Admin Dashboard**
   - Log out and log back in
   - Navigate to `/admin` to access the admin panel

### Method 2: Automated First User Admin

Run the SQL script from the application:

- Navigate to the scripts folder
- Execute `007_set_first_user_admin.sql`
- This will automatically make the first registered user an admin

## Admin Panel Features

Once you have admin access, you can:

- ✓ View all orders from all customers
- ✓ Update order statuses (Pending → Preparing → Out for Delivery → Delivered)
- ✓ View revenue statistics and order summaries
- ✓ See customer details including delivery addresses
- ✓ Access detailed order breakdowns with quantities and prices
- ✓ Receive real-time notifications for new orders

## Google OAuth Setup

To enable Google authentication:

1. **Create Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing

2. **Configure OAuth Consent Screen**

   - Set up your app name, support email, and authorized domains
   - Add scopes: `openid`, `userinfo.email`, `userinfo.profile`

3. **Create OAuth 2.0 Credentials**

   - Application type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - Your production URL
   - Authorized redirect URIs:
     - Get your Supabase callback URL from Supabase Dashboard → Authentication → Providers → Google

4. **Add to Supabase**

   - Copy Client ID and Client Secret
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider and paste credentials

5. **Test Authentication**
   - Try signing up/logging in with Google
   - Check that user profile is created automatically

## Security Notes

- Admin access is protected by middleware
  -- Only users with `role = 'ADMIN'` or `role = 'SUPER_ADMIN'` (or legacy `is_admin = true`) can access `/admin` routes
- Regular users are redirected to the homepage if they try to access admin routes
- RLS policies ensure users can only see their own orders

## Troubleshooting

- **Can't access admin panel:**
- Verify your profile has `role = 'ADMIN'` or `role = 'SUPER_ADMIN'` (or legacy `is_admin = true`)
- Try logging out and back in
- Check browser console for errors

**Google OAuth not working:**

- Verify Google OAuth credentials in Supabase
- Check redirect URLs match exactly
- Ensure OAuth consent screen is configured

For more help, check the application logs or contact support.
