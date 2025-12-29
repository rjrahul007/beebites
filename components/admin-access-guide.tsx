"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Shield, UserCog, Database, Terminal } from "lucide-react";

export function AdminAccessGuide() {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gold">
          Admin Panel Access Guide
        </h1>
        <p className="text-muted-foreground text-lg">
          How to access and manage your admin dashboard
        </p>
      </div>

      <Alert className="border-gold/30 bg-gold/5">
        <Shield className="h-4 w-4 text-gold" />
        <AlertTitle className="text-gold">Security Notice</AlertTitle>
        <AlertDescription>
          Admin access is restricted and requires database-level permissions.
          Follow the steps below to grant admin access to your account.
        </AlertDescription>
      </Alert>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-gold" />
            How to Make Your Account an Admin
          </CardTitle>
          <CardDescription>
            Follow these steps to grant admin privileges to your user account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Badge className="bg-gold text-black h-6 w-6 flex items-center justify-center shrink-0">
                1
              </Badge>
              <div>
                <h3 className="font-semibold mb-1">
                  Sign Up / Log In to the Application
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create an account or log in using email/password or Google
                  OAuth. Note your email address.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge className="bg-gold text-black h-6 w-6 flex items-center justify-center shrink-0">
                2
              </Badge>
              <div>
                <h3 className="font-semibold mb-1">
                  Access Supabase Dashboard
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Go to your Supabase project dashboard at{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                    supabase.com
                  </code>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge className="bg-gold text-black h-6 w-6 flex items-center justify-center shrink-0">
                3
              </Badge>
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Open SQL Editor
                </h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the SQL Editor in your project dashboard
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge className="bg-gold text-black h-6 w-6 flex items-center justify-center shrink-0">
                4
              </Badge>
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Run SQL Command
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Execute the following SQL command, replacing{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                    your-email@example.com
                  </code>{" "}
                  with your actual email:
                </p>
                <div className="bg-black/50 p-4 rounded-lg border border-gold/20">
                  <pre className="text-xs text-green-400 overflow-x-auto">
                    <code>{`-- Set role to ADMIN for a user by email
  UPDATE profiles
  SET role = 'ADMIN'
  WHERE id = (
    SELECT id FROM auth.users
    WHERE email = 'your-email@example.com'
  );

  -- (Legacy) Alternatively, set is_admin = true for compatibility
  UPDATE profiles
  SET is_admin = true
  WHERE id = (
    SELECT id FROM auth.users
    WHERE email = 'your-email@example.com'
  );`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge className="bg-gold text-black h-6 w-6 flex items-center justify-center shrink-0">
                5
              </Badge>
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Access Admin Dashboard
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Log out and log back in. Navigate to{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                    /admin
                  </code>{" "}
                  to access the admin panel.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle>Admin Panel Features</CardTitle>
          <CardDescription>
            What you can do once you have admin access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">✓</span>
              <span>View all orders from all customers in real-time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">✓</span>
              <span>
                Update order statuses (Pending → Preparing → Out for Delivery →
                Delivered)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">✓</span>
              <span>View revenue statistics and order summaries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">✓</span>
              <span>
                See customer details including delivery addresses and contact
                information
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">✓</span>
              <span>
                Access detailed order breakdowns with item quantities and prices
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription className="text-sm">
          <strong>Note:</strong> For security reasons, the first registered user
          can be automatically set as admin by running the SQL script in{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            scripts/
          </code>{" "}
          folder, or you can manually update any user account using the SQL
          command above.
        </AlertDescription>
      </Alert>
    </div>
  );
}
