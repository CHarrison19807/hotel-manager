import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const userCookies = cookies().get("user");
    if (userCookies) {
      const user = JSON.parse(userCookies.value as string);
      if (user.role) {
        return NextResponse.next();
      }
    } else {
      const path = request.nextUrl.pathname;
      const newUrl = new URL(`/employees?origin=${path}`, request.url);
      return NextResponse.redirect(newUrl);
    }
  }
  return NextResponse.next();
}
