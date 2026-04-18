// import { headers } from "next/headers";
import { detectBot, shield } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";
import aj from "./lib/arcjet";
import { createMiddleware } from "@arcjet/next";
// import { auth } from "./lib/auth";



export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
const validate = aj 
.withRule(shield({mode:'LIVE'}))
.withRule(detectBot({mode:'LIVE',allow:['CATEGORY:SEARCH_ENGINE' , "GOOGLE_CRAWLER"] }))

export default createMiddleware(validate)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)'],
};