// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   });

//   // Skip processing for the callback route google OAuth
//   if (request.nextUrl.pathname.startsWith("/auth/callback")) {
//     return NextResponse.next({ request });
//   }

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value)
//           );
//           supabaseResponse = NextResponse.next({
//             request,
//           });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // Redirect logged-in users away from auth pages
//   if (
//     user &&
//     (request.nextUrl.pathname.startsWith("/auth/login") ||
//       request.nextUrl.pathname.startsWith("/auth/signup"))
//   ) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   // Protect admin routes
//   if (request.nextUrl.pathname.startsWith("/admin")) {
//     if (!user) {
//       const url = request.nextUrl.clone();
//       url.pathname = "/auth/login";
//       return NextResponse.redirect(url);
//     }

//     // Check if user has ADMIN or SUPER_ADMIN role
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     const role = profile?.role as string | undefined;
//     if (
//       !role ||
//       !(role === "ADMIN" || role === "SUPER_ADMIN " || role === "KITCHEN")
//     ) {
//       const url = request.nextUrl.clone();
//       url.pathname = "/";
//       return NextResponse.redirect(url);
//     }
//   }

//   // Protect orders route
//   if (request.nextUrl.pathname.startsWith("/orders") && !user) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/auth/login";
//     return NextResponse.redirect(url);
//   }

//   return supabaseResponse;
// }

// export async function proxy(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

// import { NextRequest } from "next/server";
// import {
//   getUserAndRoleFromRequest,
//   redirectTo,
// } from "@/lib/auth/middleware-auth";

// function allow(role: string | null, allowed: string[]) {
//   return role && allowed.includes(role);
// }

// export async function updateSession(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   if (pathname.startsWith("/auth/callback")) return;

//   const { user, role, response } = await getUserAndRoleFromRequest(request);

//   if (
//     user &&
//     (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup"))
//   ) {
//     return redirectTo("/", request);
//   }

//   if (pathname.startsWith("/admin")) {
//     if (!user) return redirectTo("/auth/login", request);

//     // Route-based role permissions
//     if (pathname === "/admin") {
//       if (!allow(role, ["ADMIN"])) return redirectTo("/", request);
//     }

//     if (pathname.startsWith("/admin/menu")) {
//       if (!allow(role, ["ADMIN", "KITCHEN"])) return redirectTo("/", request);
//     }

//     if (pathname.startsWith("/admin/orders")) {
//       if (!allow(role, ["ADMIN", "KITCHEN", "DELIVERY"]))
//         return redirectTo("/", request);
//     }
//   }

//   return response;
// }

// export async function proxy(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import { NextRequest } from "next/server";
import {
  getUserAndRoleFromRequest,
  redirectTo,
} from "@/lib/auth/middleware-auth";

type AdminRole = "ADMIN" | "KITCHEN" | "DELIVERY";

function hasAccess(role: AdminRole | null, allowed: readonly AdminRole[]) {
  return role !== null && allowed.includes(role);
}

/**
 * Route-based access rules
 * Order matters: more specific first
 */
const ADMIN_ROUTE_RULES: {
  prefix: string;
  roles: readonly AdminRole[];
}[] = [
  {
    prefix: "/admin/menu",
    roles: ["ADMIN", "KITCHEN"],
  },
  {
    prefix: "/admin",
    roles: ["ADMIN", "KITCHEN", "DELIVERY"],
  },
];

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth callback
  if (pathname.startsWith("/auth/callback")) {
    return;
  }

  const { user, role, response } = await getUserAndRoleFromRequest(request);

  /* ---------- AUTH PAGES ---------- */
  if (
    user &&
    (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup"))
  ) {
    if (["ADMIN", "KITCHEN", "DELIVERY"].includes(role ?? "")) {
      return redirectTo("/admin", request);
    }

    return redirectTo("/", request);
  }

  /* ---------- HOME PAGE REDIRECT ---------- */
  // if (
  //   user &&
  //   pathname === "/" &&
  //   ["ADMIN", "KITCHEN", "DELIVERY"].includes(role ?? "")
  // ) {
  //   return redirectTo("/admin", request);
  // }

  /* ---------- ADMIN ROUTES ---------- */
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return redirectTo("/auth/login", request);
    }

    const matchedRule = ADMIN_ROUTE_RULES.find((rule) =>
      pathname.startsWith(rule.prefix)
    );

    if (
      matchedRule &&
      !hasAccess(role as AdminRole | null, matchedRule.roles)
    ) {
      return redirectTo("/", request);
    }
  }

  return response;
}

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
