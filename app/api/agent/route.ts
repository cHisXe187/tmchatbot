import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.OPENAI_WORKFLOW_ID;
    if (!apiKey || !workflowId) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY or OPENAI_WORKFLOW_ID" },
        { status: 500 }
      );
    }

    const { input = "", lang = "de" } = await req.json();
    const url = `https://api.openai.com/v1/workflows/${workflowId}/runs`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: { question: input, lang }, stream: false }),
    });

    const text = await res.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

    return NextResponse.json({ ok: res.ok, url, data }, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "server error" }, { status: 500 });
  }
}
