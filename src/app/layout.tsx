import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, DM_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Maria Gurevich — Fullstack Developer · UX Designer · AI Engineer",
  description:
    "Portfolio of Maria Gurevich — fullstack developer and UX designer building AI-powered products with the Claude API, Next.js, TypeScript, and Node.js. Features a live conversational AI chatbot built with LLM streaming.",
  keywords: [
    "fullstack developer",
    "AI engineer",
    "UX designer",
    "Claude API",
    "LLM integration",
    "Next.js",
    "TypeScript",
    "Node.js",
    "React",
    "Vercel",
    "AI chatbot",
    "portfolio",
  ],
  openGraph: {
    title: "Maria Gurevich — Fullstack Developer · UX Designer · AI Engineer",
    description:
      "Fullstack developer and UX designer building AI-powered products. Live AI chatbot demo powered by the Claude API.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maria Gurevich — Fullstack Developer · AI Engineer",
    description:
      "Portfolio featuring a live AI chatbot built with the Claude API, Next.js, and TypeScript.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${jost.variable} ${dmMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Maria Gurevich",
              jobTitle: "Fullstack Developer & AI Engineer",
              description:
                "Fullstack developer, UX designer, and AI engineer building production applications with the Claude API, Next.js, TypeScript, and Node.js.",
              knowsAbout: [
                "Fullstack Development",
                "AI Engineering",
                "LLM Integration",
                "Claude API",
                "UX Design",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Tailwind CSS",
              ],
              sameAs: [
                "https://www.linkedin.com/in/maria-gurevich-197b356a/",
                "https://github.com/nazgula",
              ],
              makesOffer: {
                "@type": "CreativeWork",
                name: "Portfolio Assistant — AI Chatbot",
                description:
                  "A conversational AI chatbot built with the Claude API and Next.js, using server-sent events for real-time LLM streaming. Answers questions about skills, work history, and availability from a curated context window.",
                applicationCategory: "AI Chatbot",
                operatingSystem: "Web",
                technology: [
                  "Claude API",
                  "Anthropic SDK",
                  "Next.js",
                  "TypeScript",
                  "Server-Sent Events",
                  "Vercel",
                ],
              },
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
