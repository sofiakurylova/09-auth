import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) return NextResponse.json({ success: true });

    if (refreshToken) {
      const apiRes = await api.get("auth/session", { 
        headers: { Cookie: cookieStore.toString() } 
      });
      const setCookie = apiRes.headers["set-cookie"];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const name = parsed.accessToken ? "accessToken" : "refreshToken";
          const value = parsed.accessToken || parsed.refreshToken;
          if (value) {
            cookieStore.set(name, value, {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed["Max-Age"]),
            });
          }
        }
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json({ success: false }, { status: error.response?.status || 500 });
    }
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
