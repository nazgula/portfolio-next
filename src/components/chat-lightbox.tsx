"use client";

import { useEffect, useRef, useCallback, useState, useMemo, type ChangeEvent } from "react";
import { track } from "@vercel/analytics";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, X, RotateCcw, ChevronDown } from "lucide-react";
import { useChatContext } from "@/lib/chatbot/chat-context";
import { personas, type PersonaId } from "@/lib/chatbot/personas";
import { cn } from "@/lib/utils";
import { PersonaAvatar } from "./persona-avatars";
import { ChatMessageList } from "./chat-message-list";

const STARTER_QUESTIONS = [
  "What's her tech stack?",
  "Tell me about her latest role",
  "What makes her different?",
];

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const transport = useMemo(
    () => new DefaultChatTransport({}),
    []
  );

  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
  } = useChat({
    id: "chat",
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

  // When persona switches, sync handoff message into useChat
  useEffect(() => {
    if (activePersona !== currentPersonaRef.current) {
      currentPersonaRef.current = activePersona;
      setMessages(contextMessages);
      prevMessagesLenRef.current = contextMessages.length;
    }
  }, [activePersona, contextMessages, setMessages]);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus input when lightbox opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Close on Escape + focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dropdownOpen) {
          setDropdownOpen(false);
          return;
        }
        closeChat();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeChat, dropdownOpen]);

  const handlePersonaSwitch = useCallback(
    (id: PersonaId) => {
      if (id === activePersona) return;
      switchPersona(id);
      setDropdownOpen(false);
    },
    [activePersona, switchPersona]
  );

  const handleRetry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    const text =
      lastUserMsg.parts
        ?.filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join("") || "";
    if (text) {
      if (messages[messages.length - 1]?.role === "assistant") {
        setMessages(messages.slice(0, -1));
      }
      sendMessage({ text }, { body: { persona: activePersona } });
    }
  }, [messages, sendMessage, setMessages, activePersona]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || status === "streaming") return;
      track("chat_prompted");
      sendMessage({ text: input }, { body: { persona: activePersona } });
      setInput("");
    },
    [input, status, sendMessage, activePersona]
  );

  if (!isOpen) return null;

  const isLoading = status === "streaming";
  const currentPersona = personas[activePersona];

  return (
    <div
      className="animate-lightbox-fade fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(15,17,23,0.94)] backdrop-blur-[12px]"
      onClick={(e) => e.target === e.currentTarget && closeChat()}
    >
      {/* Panel — full-screen on mobile, centered card on desktop */}
      <div
        ref={panelRef}
        className="relative flex flex-col overflow-hidden bg-[var(--color-surface)] shadow-[var(--shadow-dark)] w-screen h-screen sm:w-[min(760px,90vw)] sm:h-[min(600px,85vh)] sm:border sm:border-[var(--color-border)] sm:rounded-[var(--r-lg)]"
      >
        {/* Close button */}
        <button
          onClick={closeChat}
          aria-label="Close chat"
          className="absolute top-4 right-4 z-10 bg-transparent border-none p-1 cursor-pointer text-[var(--color-text-dim)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--color-text)]"
        >
          <X size={18} />
        </button>

        {/* Row 1: Persona selector — horizontal buttons on desktop, dropdown on mobile */}
        <div className="shrink-0 flex items-center border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 sm:px-6 h-[56px] sm:h-[72px]">

          {/* Desktop: horizontal button row */}
          <div className="hidden sm:flex items-center gap-2">
            {(Object.keys(personas) as PersonaId[]).map((id) => {
              const p = personas[id];
              const isActive = id === activePersona;
              return (
                <button
                  key={id}
                  onClick={() => handlePersonaSwitch(id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-pill)] border cursor-pointer transition-all duration-[var(--dur-fast)] ease-[var(--ease-out)]",
                    isActive
                      ? "bg-[var(--color-tag-bg)]"
                      : "bg-transparent hover:bg-[var(--color-surface)] hover:border-[var(--color-border-dark)]"
                  )}
                  style={{
                    borderColor: isActive ? p.accent : "var(--color-border)",
                  }}
                >
                  <PersonaAvatar personaId={id} size={20} />
                  <span
                    className={cn(
                      "font-sans text-xs font-medium",
                      isActive
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)]"
                    )}
                  >
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile: dropdown */}
          <div ref={dropdownRef} className="relative sm:hidden">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--r-pill)] border bg-[var(--color-tag-bg)] cursor-pointer transition-all duration-[var(--dur-fast)] ease-[var(--ease-out)]"
              style={{ borderColor: currentPersona.accent }}
            >
              <PersonaAvatar personaId={activePersona} size={20} />
              <span className="font-sans text-xs font-medium text-[var(--color-text)]">
                {currentPersona.label}
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  "text-[var(--color-text-muted)] transition-transform duration-[var(--dur-fast)]",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 z-20 min-w-[180px] rounded-[var(--r-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lift)] overflow-hidden">
                {(Object.keys(personas) as PersonaId[]).map((id) => {
                  const p = personas[id];
                  const isActive = id === activePersona;
                  return (
                    <button
                      key={id}
                      onClick={() => handlePersonaSwitch(id)}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3.5 py-2.5 border-none cursor-pointer transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
                        isActive
                          ? "bg-[var(--color-tag-bg)]"
                          : "bg-transparent hover:bg-[var(--color-bg)]"
                      )}
                    >
                      <PersonaAvatar personaId={id} size={18} />
                      <span
                        className={cn(
                          "font-sans text-[13px] font-medium",
                          isActive
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text-muted)]"
                        )}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Messages */}
        <div className="chat-lightbox-messages flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 p-4 sm:p-6 scrollbar-thin scrollbar-[var(--color-border)]">
          <ChatMessageList
            messages={messages}
            activePersonaId={activePersona}
            isLoading={isLoading}
          />

          {/* Starter question chips */}
          {messages.length === 1 && messages[0]?.role === "assistant" && (
            <div className="flex flex-wrap gap-2 pt-1">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    track("chat_prompted");
                    sendMessage({ text: q }, { body: { persona: activePersona } });
                  }}
                  className="px-3.5 py-1.5 rounded-[var(--r-pill)] border border-[var(--color-border)] bg-transparent font-sans text-[13px] font-normal text-[var(--color-text-muted)] cursor-pointer transition-all duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:border-[var(--color-accent-gold)] hover:text-[var(--color-text)]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="shrink-0 flex items-center justify-between px-4 py-2 font-sans text-[13px] text-[var(--color-text-muted)] bg-[rgba(220,38,38,0.08)] border-t border-[rgba(220,38,38,0.2)]">
            <span>Something went wrong. Try again?</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 bg-transparent border-none text-[var(--color-accent-gold)] cursor-pointer font-sans text-[13px] font-medium"
            >
              <RotateCcw size={12} />
              Retry
            </button>
          </div>
        )}

        {/* Row 3: Input */}
        <form
          onSubmit={handleSubmit}
          className="shrink-0 flex items-center gap-2 px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about Maria's work..."
            aria-label="Chat input"
            className="flex-1 bg-transparent border-none outline-none font-sans text-sm font-normal text-[var(--color-text)]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex items-center bg-transparent border-none transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
              !input.trim() || isLoading
                ? "text-[var(--color-text-dim)] opacity-40 cursor-not-allowed"
                : "text-[var(--color-text-dim)] cursor-pointer hover:text-[var(--color-accent-gold)]"
            )}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
