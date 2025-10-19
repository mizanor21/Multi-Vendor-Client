import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect seller routes
  if (pathname.startsWith("/seller")) {
    const sellerInfo = request.cookies.get("stallInfo");

    if (!sellerInfo) {
      return NextResponse.redirect(
        new URL("/seller/stall-request", request.url)
      );
    }
  }
  // Protect existing admin/user routes
  else {
    const authToken = request.cookies.get("bisuddho_auth");

    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/seller/login",
    "/seller/dashboard",
    "/seller/products",
    "/seller/feedback",
    "/seller/orders",
    "/seller/change-password",
  ],
};
