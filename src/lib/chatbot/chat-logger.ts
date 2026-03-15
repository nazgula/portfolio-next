import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const LOG_DIR = join(process.cwd(), "debug");
const LOG_FILE = join(LOG_DIR, "chat.log");

interface LogEntry {
  timestamp: string;
  persona: string;
  systemPrompt: string;
  messageCount: number;
  messages: { role: string; text: string }[];
}

/**
 * Log a chat API call for debugging persona switches.
 * Clears the log when a new conversation starts (single opening message).
 */
export function logChatCall(
  persona: string,
  systemPrompt: string,
  messages: { role?: string; parts?: { type: string; text?: string }[] }[]
) {
  try {
    mkdirSync(LOG_DIR, { recursive: true });

    const isNewConversation = messages.length === 1 && messages[0]?.role === "assistant";

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      persona,
      systemPrompt,
      messageCount: messages.length,
      messages: messages.map((m) => ({
        role: m.role || "unknown",
        text:
          m.parts
            ?.filter((p) => p.type === "text")
            .map((p) => p.text || "")
            .join("") || "[no text]",
      })),
    };

    const separator = "═".repeat(60);
    const lines = [
      isNewConversation ? `\n${"╔" + "═".repeat(58) + "╗"}\n║  NEW CONVERSATION\n${"╚" + "═".repeat(58) + "╝"}\n` : "",
      separator,
      `TIME: ${entry.timestamp}`,
      `PERSONA: ${entry.persona}`,
      `MESSAGES SENT: ${entry.messageCount}`,
      separator,
      "SYSTEM PROMPT:",
      entry.systemPrompt,
      separator,
      "MESSAGES:",
      ...entry.messages.map(
        (m, i) =>
          `  [${i}] ${m.role.toUpperCase()}: ${m.text.length > 200 ? m.text.slice(0, 200) + "..." : m.text}`
      ),
      separator,
      "",
    ].join("\n");

    if (isNewConversation) {
      writeFileSync(LOG_FILE, lines, "utf-8");
    } else {
      writeFileSync(LOG_FILE, lines, { encoding: "utf-8", flag: "a" });
    }
  } catch {
    // Silent fail — debug logging should never break the chat
  }
}
