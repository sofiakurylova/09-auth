import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const response = await api.get(`notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) return NextResponse.json(error.response?.data, { status: error.response?.status });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const response = await api.delete(`notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) return NextResponse.json(error.response?.data, { status: error.response?.status });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
