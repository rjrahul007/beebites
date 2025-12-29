import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "This is an API endpoint. Use POST method to sign out." }, { status: 405 })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const origin =
    request.headers.get("origin") || process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"
  return NextResponse.redirect(new URL("/auth/login", origin))
}
