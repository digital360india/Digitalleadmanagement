import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const cookieHeader = request.headers.get("cookie");
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isSalesRoute = url.pathname.startsWith("/sales");
  const isLoginRoute = url.pathname === "/login";

  const cookie = require("cookie").parse(cookieHeader || "");
  const user = cookie.user ? JSON.parse(cookie.user) : null;

  if (!user && (isAdminRoute || isSalesRoute)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && user?.status !== "admin") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isSalesRoute && user?.status !== "sales") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/login"],
};
