import { NextResponse } from "next/server";
import { parse } from "cookie";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const cookie = parse(req.headers.get("cookie") || "");
  const user = cookie.user ? JSON.parse(cookie.user) : null;

  const isDashboard = url.pathname.startsWith("/dashboard");
  const isRoot = url.pathname === "/";

  // Not logged in
  if (!user && isDashboard) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Logged in → prevent login page
  if (user && isRoot) {
    url.pathname = "/dashboard/leaddashboard";
    return NextResponse.redirect(url);
  }

  // 🔍 VERIFY PASSWORD VERSION
  if (user && isDashboard) {
    const res = await fetch(
      `${req.nextUrl.origin}/api/verify-session`,
      {
        headers: {
          "x-user-id": user.id,
          "x-password-version": user.passwordVersion,
        },
      }
    );

    if (!res.ok) {
      url.pathname = "/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("user");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
