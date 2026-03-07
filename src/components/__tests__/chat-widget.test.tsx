import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatWidget } from "../chat-widget";

// Helper: create a mock Response-like object with a readable body
function mockSSEResponse(chunks: string[]) {
  let index = 0;
  const body = {
    getReader() {
      return {
        read() {
          if (index < chunks.length) {
            const value = new Uint8Array(
              Array.from(chunks[index++]).map((c) => c.charCodeAt(0))
            );
            return Promise.resolve({ done: false, value });
          }
          return Promise.resolve({ done: true, value: undefined });
        },
      };
    },
  };
  return { ok: true, body };
}

function mockErrorResponse() {
  return { ok: false, body: null };
}

const originalFetch = global.fetch;

beforeEach(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("ChatWidget", () => {
  it("opens dialog when clicking chat icon, closes when clicking close", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Open chat"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Close chat"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows user message in a user bubble after sending", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      mockSSEResponse(["data: [DONE]\n\n"])
    );

    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByLabelText("Open chat"));

    const input = screen.getByLabelText("Chat input");
    await user.type(input, "test");
    await user.click(screen.getByLabelText("Send message"));

    const userBubble = screen.getByTestId("message-user");
    expect(userBubble).toHaveTextContent("test");
    expect(input).toHaveValue("");
  });

  it("shows error message when server returns an error", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockErrorResponse());

    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByLabelText("Open chat"));

    const input = screen.getByLabelText("Chat input");
    await user.type(input, "hello");
    await user.click(screen.getByLabelText("Send message"));

    await waitFor(() => {
      const assistantBubble = screen.getByTestId("message-assistant");
      expect(assistantBubble).toHaveTextContent("Sorry, something went wrong.");
    });
  });

  it("shows thinking indicator before assistant responds", async () => {
    let resolveFetch!: (value: unknown) => void;
    global.fetch = jest.fn().mockImplementation(
      () => new Promise((resolve) => { resolveFetch = resolve; })
    );

    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByLabelText("Open chat"));

    const input = screen.getByLabelText("Chat input");
    await user.type(input, "hello");
    await user.click(screen.getByLabelText("Send message"));

    await waitFor(() => {
      expect(screen.getByTestId("thinking-indicator")).toBeInTheDocument();
      expect(screen.getByTestId("thinking-indicator")).toHaveTextContent("Thinking...");
    });

    // Resolve fetch to clean up
    resolveFetch(mockSSEResponse(["data: [DONE]\n\n"]));

    await waitFor(() => {
      expect(screen.queryByTestId("thinking-indicator")).not.toBeInTheDocument();
    });
  });

  it("shows streamed assistant response in an assistant bubble", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      mockSSEResponse([
        'data: "this is "\n\n',
        'data: "assistant"\n\n',
        "data: [DONE]\n\n",
      ])
    );

    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByLabelText("Open chat"));

    const input = screen.getByLabelText("Chat input");
    await user.type(input, "hi");
    await user.click(screen.getByLabelText("Send message"));

    await waitFor(() => {
      const assistantBubble = screen.getByTestId("message-assistant");
      expect(assistantBubble).toHaveTextContent("this is assistant");
    });
  });
});
