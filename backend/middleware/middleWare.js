// middleware.js
const NextResponse = require('next/server');

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const protectedPaths = ["/profile"];
  const { pathname } = request.nextUrl;

  if (protectedPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
