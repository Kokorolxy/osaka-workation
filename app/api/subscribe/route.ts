import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Writes a signup into a Notion database.
 *
 * Set these as environment variables in Vercel (Project → Settings → Environment Variables):
 *   NOTION_TOKEN  – your Notion internal integration secret (starts with "ntn_" / "secret_")
 *   NOTION_DB_ID  – the database ID (the 32-char id in the database URL)
 *
 * The Notion database should have these properties (names are case-sensitive):
 *   Name     – Title
 *   Email    – Email
 *   Source   – Text (rich text)
 *   Message  – Text (rich text)   [optional]
 */
export async function POST(req: Request) {
  try {
    const { email, name, topic, message, source } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required." },
        { status: 400 },
      );
    }

    const token = process.env.NOTION_TOKEN;
    const dbId = process.env.NOTION_DB_ID;

    // Not configured yet — accept gracefully so the form still works,
    // but nothing is stored until env vars are set in Vercel.
    if (!token || !dbId) {
      console.warn(
        "[subscribe] NOTION_TOKEN / NOTION_DB_ID not set — signup not stored:",
        email,
      );
      return NextResponse.json({ ok: true, stored: false });
    }

    const sourceLabel =
      source || (topic ? `Contact · ${topic}` : "Website signup");

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties: {
          Name: {
            title: [{ text: { content: name || email } }],
          },
          Email: { email },
          Source: {
            rich_text: [{ text: { content: sourceLabel } }],
          },
          ...(message
            ? { Message: { rich_text: [{ text: { content: message } }] } }
            : {}),
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[subscribe] Notion error:", res.status, detail);
      // Still return ok so we never lose the lead to a broken UX;
      // check Vercel logs + your Notion DB schema if this fires.
      return NextResponse.json({ ok: true, stored: false });
    }

    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[subscribe] unexpected error:", err);
    return NextResponse.json({ ok: true, stored: false });
  }
}
