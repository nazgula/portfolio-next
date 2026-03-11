"use client";

import { Send } from "lucide-react";
import { useChat } from "@/lib/use-chat";
import type { Message } from "@/lib/types";

const SEED_MESSAGES: Message[] = [
  { role: "user", content: "What has Maria built with AI?" },
  {
    role: "assistant",
    content:
      "This site — a streaming chat built with the Claude API and Next.js. Try asking me anything.",
  },
];

export function InlineChat() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    handleSend,
    handleKeyDown,
  } = useChat(SEED_MESSAGES);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--r)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Messages */}
      <div
        ref={scrollRef}
        className="inline-chat-messages"
        style={{
          flex: 1,
          overflowY: "scroll",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-border) transparent",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              maxWidth: "75%",
              width: "fit-content",
              borderRadius: "4px",
              padding: "10px 14px",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              lineHeight: 1.5,
              ...(msg.role === "user"
                ? {
                    alignSelf: "flex-end",
                    marginLeft: "auto",
                    background: "var(--color-bg-deep)",
                    color: "var(--color-text-inv)",
                  }
                : {
                    alignSelf: "flex-start",
                    marginRight: "auto",
                    background: "var(--color-tag-bg)",
                    color: "var(--color-text)",
                  }),
            }}
          >
            {msg.content}
          </div>
        ))}
        {isLoading &&
          (messages.length === 0 ||
            messages[messages.length - 1].role !== "assistant") && (
            <div
              style={{
                maxWidth: "75%",
                width: "fit-content",
                alignSelf: "flex-start",
                marginRight: "auto",
                borderRadius: "4px",
                padding: "10px 14px",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                background: "var(--color-tag-bg)",
                color: "var(--color-text-muted)",
              }}
            >
              Thinking...
            </div>
          )}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "var(--sp-1) var(--sp-2)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about my work..."
          aria-label="Ask about my work"
          style={{
            flex: 1,
            height: "36px",
            padding: "0 12px",
            borderRadius: "var(--r)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 300,
            color: "var(--color-text)",
            outline: "none",
            transition: `border-color var(--dur-fast) var(--ease-out)`,
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-accent-gold)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-border)")
          }
        />
        <button
          onClick={handleSend}
          aria-label="Send message"
          disabled={!input.trim() || isLoading}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--r)",
            border: "1px solid transparent",
            background: "transparent",
            color: "var(--color-text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:
              !input.trim() || isLoading ? "not-allowed" : "pointer",
            transition: `color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)`,
            flexShrink: 0,
            opacity: !input.trim() || isLoading ? 0.4 : 1,
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !isLoading) {
              e.currentTarget.style.color = "var(--color-accent-gold)";
              e.currentTarget.style.borderColor = "var(--color-accent-gold)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
