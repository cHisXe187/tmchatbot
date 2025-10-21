import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

type WorkflowResult = {
  output?: { text?: string };
  output_text?: string;
  error?: { message?: string };
  [k: string]: unknown;
};

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

    const { input = "", lang = "de" } = (await req.json()) as {
      input?: string;
      lang?: string;
    };

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
    let data: WorkflowResult = {};
    try {
      data = text ? (JSON.parse(text) as WorkflowResult) : {};
    } catch {
      data = {};
    }

    return NextResponse.json({ ok: res.ok, url, data }, { status: res.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
