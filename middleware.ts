// import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./lib/auth";



export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)'],
};