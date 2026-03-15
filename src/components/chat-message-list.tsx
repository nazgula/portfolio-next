"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";
import { PersonaAvatar } from "./persona-avatars";
import type { UIMessage } from "ai";
import { personas as allPersonas, type PersonaId } from "@/lib/chatbot/personas";

interface ChatMessageListProps {
  messages: UIMessage[];
  activePersonaId: PersonaId;
  isLoading?: boolean;
  autoScroll?: boolean;
}

/** Parse target persona from handoff message ID (format: handoff-{personaId}-{uuid}) */
function parseHandoffTarget(id: string): PersonaId | null {
  const match = id.match(/^handoff-(\w+)-/);
  if (!match) return null;
  const candidate = match[1];
  return candidate in allPersonas ? (candidate as PersonaId) : null;
}

export function ChatMessageList({
  messages,
  activePersonaId,
  isLoading = false,
  autoScroll = true,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Build a per-message persona map by walking the messages and tracking handoffs
  const personaAtMessage: PersonaId[] = [];
  {
    let current: PersonaId = (() => {
      // Find the initial persona: it's the default unless the first handoff tells us otherwise
      // Walk backwards from the start to find the initial persona
      for (const msg of messages) {
        if (msg.id?.startsWith("handoff-")) {
          break; // first handoff means everything before it was the default
        }
      }
      // The initial persona is the one before any handoffs — we derive it from defaultPersona
      // But if the chat was opened with a non-default persona, we need the first persona
      // The simplest: check the first handoff to see what it switches FROM isn't stored in the ID
      // So we use "archivist" as the start (defaultPersona) — this is always correct
      // because the chat always starts with the default persona's opening message
      return "archivist" as PersonaId;
    })();

    for (const msg of messages) {
      if (msg.id?.startsWith("handoff-")) {
        const target = parseHandoffTarget(msg.id);
        if (target) current = target;
      }
      personaAtMessage.push(current);
    }
  }

  return (
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "inherit" }}>
      {messages.map((msg, i) => {
        const isHandoff = msg.id?.startsWith("handoff-");

        if (isHandoff) {
          const text =
            msg.parts
              ?.filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("") || "";
          return (
            <div
              key={msg.id}
              data-testid="handoff-message"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "8px 24px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  textAlign: "center",
                }}
              >
                {text}
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
            </div>
          );
        }

        const msgPersonaId = personaAtMessage[i];
        const msgPersona = allPersonas[msgPersonaId];

        const isUser = msg.role === "user";
        const showPersonaLabel =
          !isUser && (i === 0 || messages[i - 1]?.role === "user" || messages[i - 1]?.id?.startsWith("handoff-"));

        const textContent =
          msg.parts
            ?.filter((p) => p.type === "text")
            .map((p) => (p as { type: "text"; text: string }).text)
            .join("") || "";

        const toolParts =
          msg.parts?.filter(
            (p) =>
              p.type.startsWith("tool-") || p.type === "dynamic-tool"
          ) || [];

        return (
          <div key={msg.id || i} data-testid={`message-${msg.role}`}>
            {showPersonaLabel && (
              <div
                data-testid="persona-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <PersonaAvatar personaId={msgPersonaId} size={14} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: msgPersona.accent,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {msgPersona.label}
                </span>
              </div>
            )}

            {textContent && (
              <div
                style={{
                  maxWidth: "70%",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "10px 14px",
                  fontSize: "14px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  ...(isUser
                    ? {
                        alignSelf: "flex-end",
                        marginLeft: "auto",
                        background: "rgba(201, 168, 76, 0.15)",
                        color: "var(--color-text)",
                      }
                    : {
                        alignSelf: "flex-start",
                        marginRight: "auto",
                        background: "var(--color-tag-bg)",
                        color: "var(--color-text)",
                        borderLeft: `2px solid ${msgPersona.accent}`,
                      }),
                }}
              >
                {isUser ? (
                  textContent
                ) : (
                  <div className="chat-markdown">
                    <ReactMarkdown>{textContent}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {/* Tool result cards */}
            {toolParts.map((part) => {
              const toolPart = part as {
                type: string;
                toolCallId: string;
                toolName?: string;
                state?: string;
                result?: Record<string, unknown>;
              };
              const toolName =
                toolPart.toolName || toolPart.type.replace("tool-", "");
              const result = toolPart.result;

              if (!result || toolPart.state !== "result") return null;

              if (toolName === "share_cv") {
                return (
                  <a
                    key={toolPart.toolCallId}
                    href={result.url as string}
                    download
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      border: "1px solid var(--color-accent-gold)",
                      borderRadius: "var(--r)",
                      padding: "12px 16px",
                      background: "var(--color-bg)",
                      textDecoration: "none",
                      marginTop: "8px",
                      maxWidth: "70%",
                      cursor: "pointer",
                      transition:
                        "background var(--dur-fast) var(--ease-out)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-surface)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--color-bg)")
                    }
                  >
                    <FileText
                      size={16}
                      style={{ color: "var(--color-accent-gold)" }}
                    />
                    <span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          color: "var(--color-text)",
                          display: "block",
                        }}
                      >
                        maria-gurevich-cv.pdf
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          color: "var(--color-accent-gold)",
                        }}
                      >
                        Download PDF
                      </span>
                    </span>
                  </a>
                );
              }

              if (toolName === "share_contact") {
                return (
                  <div
                    key={toolPart.toolCallId}
                    style={{
                      border: "1px solid var(--color-accent-gold)",
                      borderRadius: "var(--r)",
                      padding: "12px 16px",
                      background: "var(--color-bg)",
                      marginTop: "8px",
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <a
                      href={`mailto:${result.email}`}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "var(--color-accent-gold)",
                        textDecoration: "none",
                      }}
                    >
                      {result.email as string}
                    </a>
                    <a
                      href={result.linkedin as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "var(--color-text-muted)",
                        textDecoration: "none",
                      }}
                    >
                      LinkedIn
                    </a>
                    <a
                      href={result.github as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "var(--color-text-muted)",
                        textDecoration: "none",
                      }}
                    >
                      GitHub
                    </a>
                  </div>
                );
              }

              return null;
            })}
          </div>
        );
      })}

      {isLoading &&
        (messages.length === 0 ||
          messages[messages.length - 1].role === "user") && (
          <div
            style={{
              maxWidth: "70%",
              width: "fit-content",
              borderRadius: "4px",
              padding: "10px 14px",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              background: "var(--color-tag-bg)",
              color: "var(--color-text-muted)",
              borderLeft: `2px solid ${allPersonas[activePersonaId].accent}`,
            }}
          >
            <span className="thinking-dots" aria-label="Thinking">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        )}

      <div ref={messagesEndRef} data-testid="messages-end" />
    </div>
  );
}
