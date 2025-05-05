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

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhookUrl) {
      throw new Error("Discord webhook URL is not set");
    }

    const discordRes = await fetch(discordWebhookUrl, {
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
