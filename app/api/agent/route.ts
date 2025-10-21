import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // === 1) ENV prüfen ===
    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.OPENAI_WORKFLOW_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // === 2) User-Eingabe lesen ===
    const { input = "", lang = "de" } = await req.json();

    // === 3) URL für Workflow definieren ===
    const url = `https://api.openai.com/v1/workflows/${workflowId}/runs`;

    // === 4) Anfrage an OpenAI ===
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // 🚨 Ohne diesen Header kam dein Fehler:
        "OpenAI-Beta": "workflows=v1",
      },
      body: JSON.stringify({
        input: { question: input, lang },
        stream: false,
      }),
    });

    // === 5) Antwort auswerten ===
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI request failed" },
        { status: res.status }
      );
    }

    // === 6) Text extrahieren ===
    const reply =
      data?.output?.text ||
      data?.output_text ||
      JSON.stringify(data);

    return NextResponse.json({ reply, raw: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Server error" },
      { status: 500 }
    );
  }
}
