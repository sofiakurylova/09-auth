import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../api";
import { isAxiosError } from "axios";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cookieStore = await cookies();
    const response = await api.get("notes", {
      params: Object.fromEntries(searchParams),
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) return NextResponse.json(error.response?.data, { status: error.response?.status });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const response = await api.post("notes", body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) return NextResponse.json(error.response?.data, { status: error.response?.status });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
