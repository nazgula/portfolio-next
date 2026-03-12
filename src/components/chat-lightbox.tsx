"use client";

import { useEffect, useRef, useCallback, useState, useMemo, type ChangeEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, X } from "lucide-react";
import { useChatContext } from "@/lib/chatbot/chat-context";
import { personas, type PersonaId } from "@/lib/chatbot/personas";
import { PersonaAvatar } from "./persona-avatars";
import { ChatMessageList } from "./chat-message-list";

export function ChatLightbox() {
  const {
    isOpen,
    activePersona,
    messages: contextMessages,
    closeChat,
    switchPersona,
    setMessages: setContextMessages,
    markInteracted,
  } = useChatContext();

  // Track persona to detect switches
  const currentPersonaRef = useRef(activePersona);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ body: { persona: activePersona } }),
    [activePersona]
  );

  const {
    messages,
    sendMessage,
    setMessages,
    status,
  } = useChat({
    id: `chat-${activePersona}`,
    messages: contextMessages,
    transport,
    onFinish: () => markInteracted(),
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  // Sync messages back to context (only when messages actually change from chat activity)
  const prevMessagesLenRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length !== prevMessagesLenRef.current) {
      prevMessagesLenRef.current = messages.length;
      setContextMessages(messages);
    }
  }, [messages, setContextMessages]);

  // When persona switches, reset useChat messages
  useEffect(() => {
    if (activePersona !== currentPersonaRef.current) {
      currentPersonaRef.current = activePersona;
      setMessages(contextMessages);
      prevMessagesLenRef.current = contextMessages.length;
    }
  }, [activePersona, contextMessages, setMessages]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeChat]);

  const handlePersonaSwitch = useCallback(
    (id: PersonaId) => {
      if (id === activePersona) return;
      switchPersona(id);
    },
    [activePersona, switchPersona]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || status === "streaming") return;
      sendMessage({ text: input });
      setInput("");
    },
    [input, status, sendMessage]
  );

  if (!isOpen) return null;

  const persona = personas[activePersona];
  const isLoading = status === "streaming";

  return (
    <div
      className="animate-lightbox-fade"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 17, 23, 0.94)",
        backdropFilter: "blur(12px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && closeChat()}
    >
      {/* Panel */}
      <div
        style={{
          position: "relative",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--r-lg)",
          width: "min(760px, 90vw)",
          height: "min(600px, 85vh)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "var(--shadow-dark)",
        }}
      >
        {/* Close button */}
        <button
          onClick={closeChat}
          aria-label="Close chat"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            background: "none",
            border: "none",
            color: "var(--color-text-dim)",
            cursor: "pointer",
            padding: "4px",
            transition: "color var(--dur-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-text)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-dim)")
          }
        >
          <X size={18} />
        </button>

        {/* Row 1: Persona selector bar */}
        <div
          style={{
            height: "72px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {(Object.keys(personas) as PersonaId[]).map((id) => {
            const p = personas[id];
            const isActive = id === activePersona;
            return (
              <button
                key={id}
                onClick={() => handlePersonaSwitch(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "var(--r-pill)",
                  border: `1px solid ${
                    isActive ? p.accent : "var(--color-border)"
                  }`,
                  background: isActive ? "var(--color-tag-bg)" : "transparent",
                  cursor: "pointer",
                  transition: "all var(--dur-fast) var(--ease-out)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor =
                      "var(--color-border-dark)";
                    e.currentTarget.style.background = "var(--color-surface)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <PersonaAvatar personaId={id} size={20} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: isActive
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Messages */}
        <div
          className="chat-lightbox-messages"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "scroll",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-border) transparent",
          }}
        >
          <ChatMessageList
            messages={messages}
            persona={persona}
            personaId={activePersona}
            isLoading={isLoading}
          />
        </div>

        {/* Row 3: Input */}
        <form
          onSubmit={handleSubmit}
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
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about Maria's work..."
            aria-label="Chat input"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 300,
              color: "var(--color-text)",
            }}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-dim)",
              cursor:
                !input.trim() || isLoading ? "not-allowed" : "pointer",
              transition: "color var(--dur-fast) var(--ease-out)",
              display: "flex",
              alignItems: "center",
              opacity: !input.trim() || isLoading ? 0.4 : 1,
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isLoading)
                e.currentTarget.style.color = "var(--color-accent-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-dim)";
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
