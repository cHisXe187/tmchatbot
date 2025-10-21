"use client";
import { useState } from "react";

export default function Embed() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-xl font-semibold mb-4">💬 TM Chatbot</h1>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded px-2 py-1 w-64"
          placeholder="Frag mich etwas..."
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-300"
        >
          {loading ? "Senden..." : "Senden"}
        </button>
      </div>
      <pre className="bg-white border rounded p-2 mt-4 w-full max-w-lg text-sm overflow-auto text-left">
        {response}
      </pre>
    </main>
  );
}
