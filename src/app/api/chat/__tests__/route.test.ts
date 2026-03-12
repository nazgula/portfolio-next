/**
 * @jest-environment node
 */
import { config } from "dotenv";
config({ path: ".env" });

import { POST } from "../route";

// Helper: collect the full text from a UI message stream response
async function collectStreamText(response: Response): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let raw = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    raw += decoder.decode(value, { stream: true });
  }

  return raw;
}

// Extract assistant text parts from the raw SSE stream
function extractTextFromStream(raw: string): string {
  const lines = raw.split("\n");
  let fullText = "";

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    try {
      const payload = JSON.parse(line.slice(6));
      if (payload.type === "text-delta" && typeof payload.delta === "string") {
        fullText += payload.delta;
      }
    } catch {
      // skip non-JSON lines
    }
  }

  return fullText;
}

// Check if stream contains a tool call
function hasToolCall(raw: string, toolName: string): boolean {
  return raw.includes(`"${toolName}"`);
}

// Build a UIMessage-shaped object (parts array) matching what the v6 client sends
function uiMsg(role: "user" | "assistant", text: string) {
  return {
    id: `msg-${Math.random().toString(36).slice(2)}`,
    role,
    parts: [{ type: "text", text }],
  };
}

function makeRequest(
  messages: Array<{ id: string; role: string; parts: Array<{ type: string; text: string }> }>,
  persona = "archivist"
): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, persona }),
  });
}

describe("Chat API Route", () => {
  jest.setTimeout(30_000);

  it("responds to 'Who is Maria?' with relevant info", async () => {
    const req = makeRequest([uiMsg("user", "Who is Maria?")]);
    const response = await POST(req);

    expect(response.status).toBe(200);

    const raw = await collectStreamText(response);
    const text = extractTextFromStream(raw).toLowerCase();

    expect(text).toBeTruthy();
    expect(text).toMatch(/maria/i);
  });

  it("maintains conversation context across multiple turns", async () => {
    // Turn 1
    const req1 = makeRequest([uiMsg("user", "Who is Maria?")]);
    const res1 = await POST(req1);
    const raw1 = await collectStreamText(res1);
    const text1 = extractTextFromStream(raw1);

    expect(text1).toBeTruthy();

    // Turn 2 — follow-up referencing the first answer
    const req2 = makeRequest([
      uiMsg("user", "Who is Maria?"),
      uiMsg("assistant", text1),
      uiMsg("user", "What tech stack does she work with?"),
    ]);
    const res2 = await POST(req2);

    expect(res2.status).toBe(200);

    const raw2 = await collectStreamText(res2);
    const text2 = extractTextFromStream(raw2).toLowerCase();

    expect(text2).toBeTruthy();
    // Should mention at least one technology from Maria's stack
    expect(text2).toMatch(/react|typescript|next|node|javascript/i);
  });

  it("invokes share_cv tool when user asks for CV", async () => {
    const req = makeRequest([
      uiMsg("user", "Who is Maria?"),
      uiMsg("assistant", "Maria Gurevich is a fullstack developer and designer based in Tel Aviv."),
      uiMsg("user", "Can I get her CV? I'd like to download her resume."),
    ]);
    const response = await POST(req);

    expect(response.status).toBe(200);

    const raw = await collectStreamText(response);

    // The stream should contain a share_cv tool call
    expect(hasToolCall(raw, "share_cv")).toBe(true);
  });

  it("returns 400 for invalid messages", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: "not-an-array", persona: "archivist" }),
    });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });
});
