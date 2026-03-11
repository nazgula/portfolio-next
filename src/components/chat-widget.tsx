"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/use-chat";

function ChatBubbleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    handleSend,
    handleKeyDown,
  } = useChat();

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="animate-chat-pulse"
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            zIndex: 50,
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--color-bg-deep)",
            border: "2px solid var(--color-accent-gold)",
            color: "var(--color-accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: `background var(--dur-std) var(--ease-out), color var(--dur-std) var(--ease-out)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent-gold)";
            e.currentTarget.style.color = "var(--color-bg-deep)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-bg-deep)";
            e.currentTarget.style.color = "var(--color-accent-gold)";
          }}
        >
          <ChatBubbleIcon />
        </button>
      )}

      {/* Chat dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat dialog"
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            zIndex: 50,
            width: "320px",
            height: "28rem",
            display: "flex",
            flexDirection: "column",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            boxShadow: "var(--shadow-lift)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--sp-2) var(--sp-3)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ChatBubbleIcon className="w-5 h-5" />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-text)",
                }}
              >
                Chat
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "var(--r-sm)",
                color: "var(--color-text-muted)",
                transition: `color var(--dur-fast) var(--ease-out)`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "var(--sp-2) var(--sp-3)",
            }}
          >
            {messages.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                How can I help you?
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "mb-3 flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  data-testid={`message-${msg.role}`}
                  style={{
                    maxWidth: "75%",
                    borderRadius: "var(--r-lg)",
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    lineHeight: 1.5,
                    ...(msg.role === "user"
                      ? {
                          background: "var(--color-bg-deep)",
                          color: "var(--color-text-inv)",
                        }
                      : {
                          background: "var(--color-tag-bg)",
                          color: "var(--color-text)",
                        }),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading &&
              (messages.length === 0 ||
                messages[messages.length - 1].role !== "assistant") && (
                <div className="mb-3 flex justify-start">
                  <div
                    data-testid="thinking-indicator"
                    style={{
                      maxWidth: "75%",
                      borderRadius: "var(--r-lg)",
                      padding: "8px 12px",
                      fontSize: "14px",
                      fontFamily: "var(--font-body)",
                      background: "var(--color-tag-bg)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Thinking...
                  </div>
                </div>
              )}
          </div>

          {/* Input area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "var(--sp-2) var(--sp-2)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              aria-label="Chat input"
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
                border: "none",
                background:
                  !input.trim() || isLoading
                    ? "var(--color-border)"
                    : "var(--color-bg-deep)",
                color:
                  !input.trim() || isLoading
                    ? "var(--color-text-dim)"
                    : "var(--color-text-inv)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor:
                  !input.trim() || isLoading ? "not-allowed" : "pointer",
                transition: `background var(--dur-fast) var(--ease-out)`,
                flexShrink: 0,
              }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
