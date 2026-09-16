import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isAuthenticated =
        request.cookies.get("wedding-auth")?.value === "true" &&
        !!request.cookies.get("wedding-guest")?.value;
    const isLoginPage = pathname === "/login";

    if (!isAuthenticated && !isLoginPage) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|images|fonts).*)"],
};
