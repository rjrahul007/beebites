import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminRole, UserRole } from "@/lib/domain/auth";
import type { SupabaseClient } from "@supabase/supabase-js";

interface RequireAuthOptions {
  roles?: readonly AdminRole[];
}

export async function requireAuth(options: RequireAuthOptions = {}): Promise<{
  supabase: SupabaseClient;
  user: NonNullable<any>;
  role: UserRole;
}> {
  const supabase: SupabaseClient = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/");
  }

  if (options.roles && !options.roles.includes(profile.role)) {
    redirect("/");
  }

  return {
    supabase,
    user,
    role: profile.role as UserRole,
  };
}

export async function requireUser() {
  return requireAuth();
}

export async function requireStaff(roles: readonly AdminRole[]): Promise<{
  supabase: SupabaseClient;
  user: NonNullable<any>;
  role: AdminRole;
}> {
  const result = await requireAuth({ roles });

  return {
    ...result,
    role: result.role as AdminRole,
  };
}
