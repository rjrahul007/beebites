import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { ProfileForm } from "@/components/profile-form";
import { BottomNav } from "@/components/bottom-nav";
import { requireAuth } from "@/lib/auth/require-auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { supabase, user } = await requireAuth();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      phone,
      address,
      city,
      pincode,
      image
    `
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Profile fetch error:", error);
    redirect("/auth/login");
  }
  // console.log("Profile data:", profile);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        <ProfileForm
          profile={profile}
          userEmail={user.email || ""}
          userImage={profile?.image || null}
        />
      </main>
      <BottomNav />
    </div>
  );
}
