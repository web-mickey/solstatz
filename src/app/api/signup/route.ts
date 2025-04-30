import { DISCORD_WEBHOOK_URL } from "@/lib/constants";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { telegramHandle } = await req.json();

    if (!telegramHandle || typeof telegramHandle !== "string") {
      return NextResponse.json(
        { error: "Invalid telegram handle" },
        { status: 400 }
      );
    }

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚀 New MEV Alert Signup:\nTelegram: ${telegramHandle}`,
      }),
    });

    if (!discordRes.ok) {
      throw new Error(`Discord webhook error: ${discordRes.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
