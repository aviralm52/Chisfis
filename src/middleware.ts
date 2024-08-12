// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware()

// export const config = {
//   matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc/)(.*)'],
// };

// NEXTAUTH: --> Authentication Middleware goes here

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/";

  const token = request.cookies.get("token")?.value || "";
  console.log(token);

  // Always allow access to the home route
  if (path === "/") {
    return NextResponse.next();
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Middleware will run on these routes
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verifyemail",
    "/profile",
    "/author",
    "/editproperty",
    "/account",
    "/account-password",
    "/account-billing",
    "/account-password",
    "/account-savelists",
    "/editproperty"
  ],
};
