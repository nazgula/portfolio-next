import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, tool, stepCountIs, convertToModelMessages } from "ai";
import { z } from "zod";
import {
  personas,
  defaultPersona,
  type PersonaId,
} from "@/lib/chatbot/personas";
import { buildSystemPrompt } from "@/lib/chatbot/system-prompt";

const anthropic = createAnthropic();

export async function POST(req: Request) {
  try {
    const { messages, persona: personaId } = await req.json();

    if (!Array.isArray(messages) || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const activePersona =
      personas[personaId as PersonaId] || personas[defaultPersona];
    const systemPrompt = buildSystemPrompt(activePersona);

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: systemPrompt,
      messages: modelMessages,
      tools: {
        share_cv: tool({
          description:
            "Share Maria's CV/resume as a downloadable PDF. Use when the user asks for a CV, resume, or phone number.",
          inputSchema: z.object({}),
          execute: async () => ({
            type: "cv_download" as const,
            url: "/maria-gurevich-cv.pdf",
            message: "Here is Maria's CV.",
          }),
        }),
        share_contact: tool({
          description:
            "Share Maria's contact information. Use when the user asks how to contact or reach Maria.",
          inputSchema: z.object({}),
          execute: async () => ({
            type: "contact_info" as const,
            email: "maria.gur.dev@gmail.com",
            linkedin:
              "https://linkedin.com/in/maria-gurevich-197b356a",
            github: "https://github.com/nazgula",
          }),
        }),
      },
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
