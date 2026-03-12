"use client";

import { useState, useEffect } from "react";
import { useChatContext } from "@/lib/chatbot/chat-context";

function ChatBubbleIcon() {
  return (
    <svg
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
  const { openChat, hasInteracted, isOpen } = useChatContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const card = document.getElementById("portfolio-assistant-card");
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  if (!visible || isOpen) return null;

  return (
    <button
      onClick={openChat}
      aria-label="Open chat"
      className="animate-chat-float"
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
        transition:
          "background var(--dur-std) var(--ease-out), color var(--dur-std) var(--ease-out), opacity var(--dur-std) var(--ease-out), transform var(--dur-std) var(--ease-out)",
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
      {hasInteracted && (
        <span
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--color-accent-gold)",
          }}
        />
      )}
    </button>
  );
}
