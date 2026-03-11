"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SEED_MESSAGES: Message[] = [
  { role: "user", content: "What has Maria built with AI?" },
  {
    role: "assistant",
    content:
      "This site — a streaming chat built with the Claude API and Next.js. Try asking me anything.",
  },
];

export function InlineChat() {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to get response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const data = line.replace(/^data: /, "");
          if (data === "[DONE]") break;
          try {
            const text = JSON.parse(data) as string;
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = {
                ...last,
                content: last.content + text,
              };
              return updated;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
