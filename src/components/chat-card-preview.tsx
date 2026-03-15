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
    <div className="relative w-full aspect-[16/9] rounded-[var(--r)] overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col justify-end shadow-[var(--shadow-card)] transition-shadow duration-[var(--dur-std)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-lift)]">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-hidden p-4 flex flex-col justify-end gap-3"
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
            <div className="max-w-[85%] w-fit rounded-[4px] px-3.5 py-2.5 text-[13px] font-sans font-normal leading-relaxed bg-[var(--color-tag-bg)] text-[var(--color-text)] border-l-2 border-l-[var(--color-accent-gold)]">
              I&apos;m the Archivist. Ask me about Maria&apos;s work — or pick
              a guide: ⚓ Saltwood · 👾 Glitch · 🕐 Voss
            </div>

            {/* User bubble */}
            <div className="max-w-[70%] w-fit rounded-[4px] px-3.5 py-2.5 text-[13px] font-sans font-normal leading-normal self-end ml-auto bg-[rgba(201,168,76,0.15)] text-[var(--color-text)]">
              Choose your guide. Ask anything.
            </div>
          </>
        )}
      </div>

      {/* Fake input bar — visual only */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg)] pointer-events-none opacity-50">
        <div className="flex-1 font-sans text-sm font-normal text-[var(--color-text-dim)]">
          Ask about Maria&apos;s work...
        </div>
        <div className="flex items-center text-[var(--color-text-dim)]">
          <Send size={16} />
        </div>
      </div>

      {/* Click overlay */}
      <div
        onClick={openChat}
        className="absolute inset-0 cursor-pointer z-[1]"
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
