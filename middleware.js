// import { NextResponse } from "next/server";
// import { parse } from "cookie";

// export function middleware(request) {
//   const url = request.nextUrl.clone();
//   const cookieHeader = request.headers.get("cookie");

//   const isAdminRoute = url.pathname.startsWith("/admin/leads");
//   const isSalesRoute = url.pathname.startsWith("/sales/leads");
//   const isRootRoute = url.pathname === "/";

//   const cookie = parse(cookieHeader || "");
//   const user = cookie.user ? JSON.parse(cookie.user) : null;

//   // Redirect unauthenticated users from protected routes
//   if (!user && (isAdminRoute || isSalesRoute)) {
//     if (!isRootRoute) {
//       url.pathname = "/";
//       return NextResponse.redirect(url);
//     }
//   }

//   // Redirect authenticated users away from the login page
//   if (user && isRootRoute) {
//     // Optional: redirect based on user role
//     if (user.status === "admin") {
//       url.pathname = "/admin/leads";
//     } else if (user.status === "sales") {
//       url.pathname = "/sales/leads";
//     } else {
//       url.pathname = "/";
//     }
//     return NextResponse.redirect(url);
//   }

//   // Restrict access to role-specific pages
//   if (isAdminRoute && user?.status !== "admin") {
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   if (isSalesRoute && user?.status !== "sales") {
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/sales/:path*", "/"],
// };

import { NextResponse } from "next/server";
import { parse } from "cookie";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const cookieHeader = request.headers.get("cookie");

  const isDashboardRoute = url.pathname.startsWith("/dashboard");
  const isRootRoute = url.pathname === "/";

  const cookie = parse(cookieHeader || "");
  const user = cookie.user ? JSON.parse(cookie.user) : null;

  // Redirect unauthenticated users from protected routes
  if (!user && isDashboardRoute) {
    if (!isRootRoute) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from the login page
  if (user && isRootRoute) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Restrict access to dashboard based on role
  if (isDashboardRoute && !["admin", "sales"].includes(user?.status)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};