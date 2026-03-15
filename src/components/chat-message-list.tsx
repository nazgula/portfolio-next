"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";
import { PersonaAvatar } from "./persona-avatars";
import { cn } from "@/lib/utils";
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
    let current: PersonaId = "archivist";
    for (const msg of messages) {
      if (msg.id?.startsWith("handoff-")) {
        const target = parseHandoffTarget(msg.id);
        if (target) current = target;
      }
      personaAtMessage.push(current);
    }
  }

  return (
    <div className="mt-auto flex flex-col gap-[inherit]">
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
              className="flex items-center gap-3 mx-6 my-2"
            >
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="font-sans text-[13px] italic text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line text-center">
                {text}
              </span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
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
                className="flex items-center gap-1.5 mb-1"
              >
                <PersonaAvatar personaId={msgPersonaId} size={14} />
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: msgPersona.accent }}
                >
                  {msgPersona.label}
                </span>
              </div>
            )}

            {textContent && (
              <div
                className={cn(
                  "max-w-[70%] w-fit rounded-[4px] px-3.5 py-2.5 text-sm font-sans font-normal leading-normal",
                  isUser
                    ? "self-end ml-auto bg-[rgba(201,168,76,0.15)] text-[var(--color-text)]"
                    : "self-start mr-auto bg-[var(--color-tag-bg)] text-[var(--color-text)] border-l-2"
                )}
                style={!isUser ? { borderLeftColor: msgPersona.accent } : undefined}
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
                    className="flex items-center gap-3 border border-[var(--color-accent-gold)] rounded-[var(--r)] px-4 py-3 bg-[var(--color-bg)] no-underline mt-2 max-w-[70%] cursor-pointer transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-[var(--color-surface)]"
                  >
                    <FileText
                      size={16}
                      className="text-[var(--color-accent-gold)]"
                    />
                    <span>
                      <span className="font-mono text-xs text-[var(--color-text)] block">
                        maria-gurevich-cv.pdf
                      </span>
                      <span className="font-sans text-xs text-[var(--color-accent-gold)]">
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
                    className="border border-[var(--color-accent-gold)] rounded-[var(--r)] px-4 py-3 bg-[var(--color-bg)] mt-2 max-w-[70%] flex flex-col gap-1"
                  >
                    <a
                      href={`mailto:${result.email}`}
                      className="font-sans text-[13px] text-[var(--color-accent-gold)] no-underline"
                    >
                      {result.email as string}
                    </a>
                    <a
                      href={result.linkedin as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[13px] text-[var(--color-text-muted)] no-underline"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={result.github as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[13px] text-[var(--color-text-muted)] no-underline"
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
            className="max-w-[70%] w-fit rounded-[4px] px-3.5 py-2.5 text-sm font-sans bg-[var(--color-tag-bg)] text-[var(--color-text-muted)] border-l-2"
            style={{ borderLeftColor: allPersonas[activePersonaId].accent }}
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
