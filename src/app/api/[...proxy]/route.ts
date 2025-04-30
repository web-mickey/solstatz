import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, context: any) {
  return handleProxy(req, await context.params);
}

export async function POST(req: NextRequest, context: any) {
  return handleProxy(req, await context.params);
}

async function handleProxy(req: NextRequest, params: { proxy: string[] }) {
  try {
    if (!params?.proxy) {
      return NextResponse.json(
        { error: "Missing proxy parameters" },
        { status: 400 }
      );
    }

    const path = params.proxy.join("/");
    const targetUrl = `${BACKEND_URL}/${path}`;

    const headers = new Headers(req.headers);
    headers.set("host", new URL(BACKEND_URL).host);

    const response = await fetch(targetUrl, {
      method: req.method || "GET",
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD" ? await req.text() : null,
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Proxy request failed:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
