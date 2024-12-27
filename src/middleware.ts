import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Custom middleware
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    // Redirect authenticated users away from authentication pages
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // Redirect unauthenticated users trying to access restricted areas
    if (url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify", "/dashboard", "/"],
};

