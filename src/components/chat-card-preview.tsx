"use client";

import { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useChatContext } from "@/lib/chatbot/chat-context";
import { ChatMessageList } from "./chat-message-list";

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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: "var(--r)",
        overflow: "hidden",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
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
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        {hasInteracted ? (
          <ChatMessageList
            messages={messages}
            activePersonaId={activePersona}
            autoScroll={false}
          />
        ) : (
          <>
            {/* Assistant bubble */}
            <div
              style={{
                maxWidth: "85%",
                width: "fit-content",
                borderRadius: "4px",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                lineHeight: 1.6,
                background: "var(--color-tag-bg)",
                color: "var(--color-text)",
                borderLeft: "2px solid var(--color-accent-gold)",
              }}
            >
              I&apos;m the Archivist. Ask me about Maria&apos;s work — or pick
              a guide: ⚓ Saltwood · 👾 Glitch · 🕐 Voss
            </div>

            {/* User bubble */}
            <div
              style={{
                maxWidth: "70%",
                width: "fit-content",
                borderRadius: "4px",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                lineHeight: 1.5,
                alignSelf: "flex-end",
                marginLeft: "auto",
                background: "rgba(201, 168, 76, 0.15)",
                color: "var(--color-text)",
              }}
            >
              Choose your guide. Ask anything.
            </div>
          </>
        )}
      </div>

      {/* Fake input bar — visual only */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid var(--color-border)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--color-bg)",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 400,
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
