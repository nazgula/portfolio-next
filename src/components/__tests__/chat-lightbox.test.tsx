import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatLightbox } from "../chat-lightbox";
import { ChatProvider, useChatContext } from "@/lib/chatbot/chat-context";
import type { UIMessage } from "ai";

// ── Mocks ──────────────────────────────────────────────────────────

const mockSendMessage = jest.fn();
const mockSetMessages = jest.fn();

let mockMessages: UIMessage[] = [];
let mockStatus = "ready";

jest.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockMessages,
    sendMessage: mockSendMessage,
    setMessages: mockSetMessages,
    status: mockStatus,
  }),
}));

jest.mock("ai", () => ({
  DefaultChatTransport: jest.fn(),
}));

// ── Helpers ────────────────────────────────────────────────────────

function makeMessage(
  role: "user" | "assistant",
  text: string,
  id?: string
): UIMessage {
  return {
    id: id || `msg-${Math.random().toString(36).slice(2)}`,
    role,
    parts: [{ type: "text" as const, text }],
  };
}

/**
 * Renders ChatLightbox inside a ChatProvider that is already open.
 * We do this by rendering the provider, then programmatically opening.
 */
function renderOpenLightbox(messages: UIMessage[] = []) {
  mockMessages = messages;

  // We need to open the chat after render. Use a helper component.
  function AutoOpen({ children }: { children: React.ReactNode }) {
    const { openChat } = useChatContext();
    useEffect(() => {
      openChat();
    }, [openChat]);
    return <>{children}</>;
  }

  return render(
    <ChatProvider>
      <AutoOpen>
        <ChatLightbox />
      </AutoOpen>
    </ChatProvider>
  );
}

// ── Tests ──────────────────────────────────────────────────────────

beforeEach(() => {
  mockMessages = [];
  mockStatus = "ready";
  mockSendMessage.mockClear();
  mockSetMessages.mockClear();
  (Element.prototype.scrollIntoView as jest.Mock).mockClear();
});

describe("ChatLightbox", () => {
  it("displays assistant response in a persona bubble with persona label", () => {
    const greeting = makeMessage("assistant", "Hello, I am the Archivist.");

    renderOpenLightbox([greeting]);

    // Persona label should appear above the assistant bubble
    const label = screen.getByTestId("persona-label");
    expect(label).toHaveTextContent("The Archivist");

    // The assistant bubble should contain the message text
    const bubble = screen.getByTestId("message-assistant");
    expect(bubble).toHaveTextContent("Hello, I am the Archivist.");
  });

  it("displays user prompt in a user bubble", () => {
    const userMsg = makeMessage("user", "Who is Maria?");
    const assistantMsg = makeMessage("assistant", "Maria is a developer.");

    renderOpenLightbox([userMsg, assistantMsg]);

    const userBubble = screen.getByTestId("message-user");
    expect(userBubble).toHaveTextContent("Who is Maria?");

    // User bubble should be right-aligned (marginLeft: auto)
    const userTextDiv = userBubble.querySelector("div");
    expect(userTextDiv).toHaveStyle({ marginLeft: "auto" });
  });

  it("shows persona label only on the first assistant message in a group", () => {
    const msg1 = makeMessage("user", "Hi");
    const msg2 = makeMessage("assistant", "Hello!");
    const msg3 = makeMessage("user", "Tell me more");
    const msg4 = makeMessage("assistant", "Sure thing.");

    renderOpenLightbox([msg1, msg2, msg3, msg4]);

    // Both assistant messages should show persona labels
    // (each follows a user message)
    const labels = screen.getAllByTestId("persona-label");
    expect(labels).toHaveLength(2);
  });

  it("scrolls the last message into viewport when messages update", async () => {
    const initialMessages = [makeMessage("assistant", "Welcome.")];
    renderOpenLightbox(initialMessages);

    // Clear any calls from initial render
    (Element.prototype.scrollIntoView as jest.Mock).mockClear();

    // Simulate new messages arriving by updating the mock and re-rendering
    mockMessages = [
      ...initialMessages,
      makeMessage("user", "Hello"),
      makeMessage("assistant", "How can I help?"),
    ];

    // Force a re-render by triggering a state change (type in input)
    const user = userEvent.setup();
    const input = screen.getByLabelText("Chat input");
    await user.type(input, "x");

    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    const anchor = screen.getByTestId("messages-end");
    expect(anchor).toBeInTheDocument();
  });

  it("sends user input and clears the field on submit", async () => {
    const user = userEvent.setup();
    renderOpenLightbox([makeMessage("assistant", "Ask me anything.")]);

    const input = screen.getByLabelText("Chat input");
    await user.type(input, "Who is Maria?");
    expect(input).toHaveValue("Who is Maria?");

    await user.click(screen.getByLabelText("Send message"));

    expect(mockSendMessage).toHaveBeenCalledWith({ text: "Who is Maria?" });
    expect(input).toHaveValue("");
  });

  it("does not render when chat is closed", () => {
    mockMessages = [makeMessage("assistant", "Hello")];

    // Render WITHOUT opening
    render(
      <ChatProvider>
        <ChatLightbox />
      </ChatProvider>
    );

    expect(screen.queryByTestId("message-assistant")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Chat input")).not.toBeInTheDocument();
  });
});
