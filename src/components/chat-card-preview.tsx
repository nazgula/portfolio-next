"use client";

import { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useChatContext } from "@/lib/chatbot/chat-context";
import { personas, type PersonaId } from "@/lib/chatbot/personas";
import { PersonaAvatar } from "./persona-avatars";
import { ChatMessageList } from "./chat-message-list";

const personaIntros: { id: PersonaId; emoji: string; tagline: string }[] = [
  { id: "archivist", emoji: "📜", tagline: "Professional guide" },
  { id: "barnaby", emoji: "🏴‍☠️", tagline: "Old pirate friend" },
  { id: "glitch", emoji: "👻", tagline: "Bitter banished spirit" },
  { id: "voss", emoji: "🕰️", tagline: "Time traveler from Cronus" },
];

export function ChatCardPreview() {
  const { hasInteracted, activePersona, messages, openChat } =
    useChatContext();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update (post-interaction)
  useEffect(() => {
    if (hasInteracted && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, hasInteracted]);

  const persona = personas[activePersona];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 10",
        borderRadius: "var(--r)",
        overflow: "hidden",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-card)",
        transition: "box-shadow var(--dur-std) var(--ease-out)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-lift)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
    >
      {/* Messages area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {hasInteracted ? (
          <ChatMessageList
            messages={messages}
            persona={persona}
            personaId={activePersona}
            autoScroll={false}
          />
        ) : (
          <>
            {/* Assistant bubble: persona introductions */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <PersonaAvatar personaId="archivist" size={14} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--color-accent-gold)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {personas.archivist.label}
                </span>
              </div>
              <div
                style={{
                  maxWidth: "85%",
                  width: "fit-content",
                  borderRadius: "4px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  background: "var(--color-tag-bg)",
                  color: "var(--color-text)",
                  borderLeft: "2px solid var(--color-accent-gold)",
                }}
              >
                {personaIntros.map(({ id, emoji, tagline }) => (
                  <div
                    key={id}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span>{emoji}</span>
                    <span>
                      <strong style={{ fontWeight: 500 }}>
                        {personas[id].label}
                      </strong>{" "}
                      — {tagline}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* User bubble: CTA */}
            <div
              style={{
                maxWidth: "70%",
                width: "fit-content",
                borderRadius: "4px",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                lineHeight: 1.5,
                alignSelf: "flex-end",
                marginLeft: "auto",
                background: "var(--color-bg-deep)",
                color: "var(--color-text-inv)",
              }}
            >
              Choose your guide. Ask anything.
            </div>
          </>
        )}
      </div>

      {/* Fake input bar */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid var(--color-border)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--color-bg)",
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 300,
            color: "var(--color-text-dim)",
          }}
        >
          Ask about Maria&apos;s work...
        </div>
        <div
          style={{
            color: "var(--color-text-dim)",
            display: "flex",
            alignItems: "center",
            opacity: 0.4,
          }}
        >
          <Send size={16} />
        </div>
      </div>

      {/* Click overlay — captures all clicks, opens lightbox */}
      <div
        onClick={openChat}
        style={{
          position: "absolute",
          inset: 0,
          cursor: "pointer",
          zIndex: 1,
        }}
        aria-label="Open chat"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openChat();
          }
        }}
      />
    </div>
  );
}
