import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatWidget } from "../chat-widget";

describe("ChatWidget", () => {
  it("opens dialog when clicking chat icon, closes when clicking close", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    // Dialog should not be visible initially
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Open chat
    await user.click(screen.getByLabelText("Open chat"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close chat
    await user.click(screen.getByLabelText("Close chat"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows user message in a user bubble after sending", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    // Open chat
    await user.click(screen.getByLabelText("Open chat"));

    // Type and send message
    const input = screen.getByLabelText("Chat input");
    await user.type(input, "test");
    await user.click(screen.getByLabelText("Send message"));

    // Verify user bubble contains the message
    const userBubble = screen.getByTestId("message-user");
    expect(userBubble).toHaveTextContent("test");

    // Input should be cleared
    expect(input).toHaveValue("");
  });
});
