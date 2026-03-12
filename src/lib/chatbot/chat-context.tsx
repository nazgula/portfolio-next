"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type PersonaId, defaultPersona, personas } from "./personas";
import type { UIMessage } from "ai";

interface ChatState {
  isOpen: boolean;
  activePersona: PersonaId;
  messages: UIMessage[];
  hasInteracted: boolean;
}

interface ChatContextValue extends ChatState {
  openChat: () => void;
  closeChat: () => void;
  switchPersona: (id: PersonaId) => void;
  setMessages: React.Dispatch<React.SetStateAction<UIMessage[]>>;
  markInteracted: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function makeOpeningMessage(personaId: PersonaId): UIMessage {
  return {
    id: "opening",
    role: "assistant",
    parts: [{ type: "text", text: personas[personaId].openingMessage }],
  };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatState>({
    isOpen: false,
    activePersona: defaultPersona,
    messages: [makeOpeningMessage(defaultPersona)],
    hasInteracted: false,
  });

  const openChat = useCallback(() => {
    setState((s) => ({ ...s, isOpen: true }));
  }, []);

  const closeChat = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }));
  }, []);

  const switchPersona = useCallback((id: PersonaId) => {
    setState((s) => ({
      ...s,
      activePersona: id,
      messages: [makeOpeningMessage(id)],
    }));
  }, []);

  const setMessages = useCallback(
    (updater: React.SetStateAction<UIMessage[]>) => {
      setState((s) => ({
        ...s,
        messages:
          typeof updater === "function" ? updater(s.messages) : updater,
      }));
    },
    []
  );

  const markInteracted = useCallback(() => {
    setState((s) => ({ ...s, hasInteracted: true }));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        openChat,
        closeChat,
        switchPersona,
        setMessages,
        markInteracted,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be inside ChatProvider");
  return ctx;
}
