import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public paths that don't require authentication
    const publicPaths = ["/login", "/register"];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Get the session token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // If trying to access protected route without token, redirect to login
    if (!isPublicPath && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If trying to access auth pages with token, redirect to dashboard
    if (isPublicPath && token) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // For authenticated routes, add user role to headers for Server Components
    if (token && pathname.startsWith("/dashboard")) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-role", token.role as string);
        requestHeaders.set("x-user-id", token.id as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
