import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/lib/domain/auth";

export async function getUserAndRoleFromRequest(request: NextRequest): Promise<{
  user: any;
  role: UserRole | null;
  response: NextResponse;
}> {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: null, response };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile?.role) {
    // Treat missing profile as unauthenticated for safety
    return { user: null, role: null, response };
  }

  return {
    user,
    role: profile?.role as UserRole,
    response,
  };
}
export function redirectTo(path: string, request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}
