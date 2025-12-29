import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, Pizza, BellElectric } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartButton } from "@/components/cart-button";
import { NotificationProvider } from "@/components/notification-provider";
import { SignOutButton } from "@/components/sign-out-button";
import { IoFastFood, IoFastFoodOutline } from "react-icons/io5";
import Image from "next/image";
export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-0">
          <Image
            src={"/images/logo/Bee_logo_black_transparent.png"}
            alt="BeeBites Logo"
            width={150}
            height={150}
            className="-mr-10 -mt-4"
          />
          {/* <IoFastFoodOutline className="h-8 w-8 text-primary" /> */}
          {/* <span className="text-xl font-bold text-balance hidden sm:inline">
            BeeBites
          </span> */}
          {/* <span className="text-xl font-bold text-balance sm:hidden">
            BeeBites
          </span> */}
          <span className="text-xl font-bold">Bites</span>
        </Link>

        <nav className="flex items-center space-x-2 md:space-x-4">
          {user ? (
            <>
              <NotificationProvider userId={user.id} />
              <CartButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  {profile?.role &&
                    ["ADMIN", "SUPER_ADMIN", "KITCHEN", "DELIVERY"].includes(
                      profile.role
                    ) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
