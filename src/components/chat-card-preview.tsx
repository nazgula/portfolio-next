"use client";

import { useChatContext } from "@/lib/chatbot/chat-context";
import { personas, type PersonaId } from "@/lib/chatbot/personas";
import { PersonaAvatar } from "./persona-avatars";

export function ChatCardPreview() {
  const { hasInteracted, activePersona, messages, openChat } =
    useChatContext();

  if (hasInteracted) {
    const lastMsg = [...messages].reverse().find((m) => m.role === "assistant");
    const lastMsgText = lastMsg?.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("") || "";
    const persona = personas[activePersona];

    return (
      <div
        onClick={openChat}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "24px",
          cursor: "pointer",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--r)",
          transition: "border-color var(--dur-std) var(--ease-out)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-accent-gold)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-border)")
        }
      >
        <PersonaAvatar personaId={activePersona} size={32} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-text-muted)",
            marginTop: "8px",
          }}
        >
          {persona.label}
        </span>
        {lastMsgText && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--color-text-dim)",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            {lastMsgText}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-accent-gold)",
            marginTop: "8px",
          }}
        >
          Continue conversation →
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={openChat}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "16px",
        cursor: "pointer",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--r)",
        transition: "border-color var(--dur-std) var(--ease-out)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-accent-gold)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border)")
      }
    >
      {/* 2×2 persona grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          width: "100%",
          maxWidth: "240px",
        }}
      >
        {(Object.keys(personas) as PersonaId[]).map((id) => {
          const p = personas[id];
          return (
            <div
              key={id}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--r)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <PersonaAvatar personaId={id} size={32} />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  textAlign: "center",
                }}
              >
                {p.label}
              </span>
            </div>
          );
        })}
      </div>

      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--color-text-dim)",
          marginTop: "12px",
        }}
      >
        Choose your guide. Ask anything.
      </span>
    </div>
  );
}
