"use client";

import { useState } from "react";
import { ChatWidget } from "@/components/chat-widget";
import { ChatLightbox } from "@/components/chat-lightbox";
import { ChatCardPreview } from "@/components/chat-card-preview";
import { ChatProvider } from "@/lib/chatbot/chat-context";
import { ProjectGallery } from "@/components/project-gallery";
import { Lightbox } from "@/components/lightbox";
import { DecoRule } from "@/components/deco-rule";
import { Linkedin, Github } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import projects from "@/data/projects.json";

interface LightboxState {
  imgDir: string;
  images: GalleryImage[];
  index: number;
}

function getRoleChipStyle(role: string) {
  const r = role.toLowerCase();
  if (r.includes("full stack") || r.includes("fullstack"))
    return { background: "#D0EBEB", color: "#1A5A5A" };
  if (r.includes("frontend"))
    return { background: "#D4E0F8", color: "#1A3A8A" };
  if (r.includes("web designer"))
    return { background: "#F0E8D0", color: "#7A5A1A" };
  if (r.includes("ai engineer"))
    return { background: "#E8E0F0", color: "#3A1A5A" };
  if (r.includes("freelance"))
    return { background: "#E8E0D0", color: "#5A4A35" };
  return { background: "var(--color-tag-bg)", color: "var(--color-tag-text)" };
}

export default function Home() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = (
    imgDir: string,
    images: GalleryImage[],
    index: number
  ) => {
    setLightbox({ imgDir, images, index });
  };

  return (
    <ChatProvider>
    <div className="bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* ── Hero ── */}
      <header className="hero-section animate-fade-down p-0 relative bg-[var(--color-surface)] min-h-[clamp(320px,45vw,520px)] mb-[var(--sp-6)] flex items-center overflow-hidden">
        {/* Hero Image — left, fading inward */}
        <div className="absolute left-0 top-0 bottom-0 w-1/4 pt-4 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/creation.png"
            alt=""
            className="block w-full h-full object-cover object-[center_15%] opacity-70"
            style={{
              maskImage: "linear-gradient(to right, rgba(0,0,0,1) 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>

        {/* Hero Text */}
        <div className="w-full pt-[var(--sp-12)] px-[var(--margin)] pb-[var(--sp-6)] text-center relative">
          <span className="corner-ornament top-left" />
          <span className="corner-ornament top-right" />
          <span className="corner-ornament bottom-left" />
          <span className="corner-ornament bottom-right" />

          <h1 className="font-[var(--font-display)] text-[clamp(48px,7vw,88px)] font-light tracking-[-0.03em] leading-[1.1] text-[var(--color-text)] m-0 mb-[var(--sp-2)]">
          Maria Gurevich
        </h1>

        <p className="font-[var(--font-body)] text-[clamp(11px,1.2vw,13px)] font-medium tracking-[0.2em] uppercase text-[var(--color-text-muted)] m-0 mb-[var(--sp-2)]">
          Fullstack Developer &middot; UX Designer &middot; Building with AI
        </p>

        <div className="w-full max-w-[320px] h-px bg-[var(--color-border)] mx-auto mb-[var(--sp-3)]" />

        <p className="hero-tagline font-[var(--font-display)] text-[clamp(22px,3vw,32px)] font-normal text-[var(--color-text-muted)] mx-auto mb-[var(--sp-3)] text-center w-full block">
          I build what I want because I can.
        </p>

          <DecoRule />
        </div>
      </header>

      {/* ── Work Section ── */}
      <section id="work" className="projects-container deco-pattern bg-[var(--color-bg)] pt-[var(--sp-8)] px-[var(--margin)] pb-0">
        <div className="max-w-[var(--max-width)] mx-auto">
        {/* ── Portfolio Assistant (AI project card) ── */}
        <div id="portfolio-assistant-card" className="project-card animate-fade-up flex flex-row gap-[var(--sp-6)] py-[var(--sp-2)] px-0 mb-[var(--sp-12)] bg-[var(--color-surface)] rounded-[var(--r)] shadow-[var(--shadow-card)] [animation-fill-mode:both]">
          {/* Text side */}
          <div className="flex-[1_1_55%] min-w-0 py-[var(--sp-2)] px-[var(--sp-6)]">
            <h2 className="font-[var(--font-display)] text-[28px] font-medium tracking-[-0.01em] text-[var(--color-text)] mb-[var(--sp-1)]">
              Portfolio Assistant
            </h2>

            <div className="flex flex-wrap items-center gap-[var(--sp-1)] mb-[var(--sp-2)]">
              <span className="font-[var(--font-mono)] text-[12px] text-[var(--color-text-dim)] tracking-[0.06em]">
                2025 · Ongoing
              </span>
              <span
                className="rounded-[var(--r-pill)] px-3 py-0.5 text-[11px] font-medium font-[var(--font-body)]"
                style={{ background: "#E8E0F0", color: "#3A1A5A" }}
              >
                AI Engineer
              </span>
            </div>

            <p className="font-[var(--font-body)] text-[18px] font-normal leading-[1.7] text-[var(--color-text-muted)] max-w-[560px] mb-[var(--sp-2)] text-justify">
              A conversational AI built with the Claude API and Vercel AI SDK, deployed on Next.js. Ask it anything about my work, skills, or availability — it answers from a curated context window.
            </p>

            <div className="tech-stack font-[var(--font-mono)] text-[13px] font-medium tracking-[0.04em] text-[var(--color-text)]">
              Claude API · Vercel AI SDK · Next.js · TypeScript
            </div>
          </div>

          {/* Live chat demo */}
          <div className="project-gallery-col flex-[1_1_45%] min-w-0 py-[var(--sp-2)] px-[var(--sp-4)] flex items-center">
            <ChatCardPreview />
          </div>
        </div>

        <DecoRule className="card-divider" />

        {projects.map((project, i) => {
          const isReverse = i % 2 === 1;
          const chipStyle = getRoleChipStyle(project.role);
          const techItems = project.stack
            ? project.stack.split("·").map((t) => t.trim())
            : [];

          return (
            <div key={i}>
            {i > 0 && <DecoRule className="card-divider" />}
            <div
              className={`project-card animate-fade-up ${isReverse ? "flex-row-reverse reverse" : "flex-row"} flex gap-[var(--sp-6)] py-[var(--sp-6)] px-0 mb-[var(--sp-12)] bg-[var(--color-surface)] rounded-[var(--r)] border-t-2 border-t-[var(--color-accent-gold)] shadow-[var(--shadow-card)] [animation-fill-mode:both]`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Project Info */}
              <div className="flex-[1_1_55%] min-w-0 py-[var(--sp-4)] px-[var(--sp-6)]">
                <h2 className="font-[var(--font-display)] text-[28px] font-medium tracking-[-0.01em] text-[var(--color-text)] mb-[var(--sp-1)]">
                  {project.name}
                </h2>

                <div className="flex flex-wrap items-center gap-[var(--sp-1)] mb-[var(--sp-2)]">
                  {project.dateRange && (
                    <span className="font-[var(--font-mono)] text-[12px] text-[var(--color-text-dim)] tracking-[0.06em]">
                      {project.dateRange}
                    </span>
                  )}
                  {project.role && (
                    <span
                      className="rounded-[var(--r-pill)] px-3 py-0.5 text-[11px] font-medium font-[var(--font-body)]"
                      style={chipStyle}
                    >
                      {project.role}
                    </span>
                  )}
                </div>

                <p className="font-[var(--font-body)] text-[18px] font-normal leading-[1.7] text-[var(--color-text-muted)] max-w-[560px] mb-[var(--sp-2)] text-justify">
                  {project.description}
                </p>

                {techItems.length > 0 && (
                  <div className="tech-stack font-[var(--font-mono)] text-[13px] font-medium tracking-[0.04em] leading-[2] text-[var(--color-text)]">
                    {techItems.join(" · ")}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="project-gallery-col flex-[1_1_45%] min-w-0 py-[var(--sp-2)] px-[var(--sp-4)] flex items-center">
                <ProjectGallery
                  imgDir={project.imgDir}
                  images={project.images || []}
                  projectName={project.name}
                  onImageClick={openLightbox}
                />
              </div>
            </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* ── Resume CTA ── */}
      <div className="deco-pattern bg-[var(--color-bg)] py-[var(--sp-8)] px-[var(--margin)] text-center">
        <div className="w-full h-px bg-[var(--color-border)] mb-[var(--sp-6)]" />
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-[var(--font-body)] text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)] rounded-[var(--r)] px-7 py-2.5 no-underline transition-[background,color] duration-[var(--dur-std)] ease-[var(--ease-out)] hover:bg-[var(--color-accent-gold)] hover:text-[var(--color-text)]"
        >
          Full Resume
        </a>
        <div className="w-full h-px bg-[var(--color-border)] mt-[var(--sp-6)]" />
      </div>

      {/* ── Footer ── */}
      <footer className="contact-section bg-[var(--color-surface)] py-[var(--sp-8)] px-[var(--margin)] text-center">
        <DecoRule className="mb-6" />

        <div className="flex items-center justify-center gap-[var(--sp-3)] flex-wrap">
          <a
            href="mailto:maria.gur.dev@gmail.com"
            className="font-[var(--font-body)] text-[15px] font-normal text-[var(--color-text)] no-underline transition-colors duration-[var(--dur-std)] ease-[var(--ease-out)] inline-block hover:text-[var(--color-accent-gold)]"
          >
            maria.gur.dev@gmail.com
          </a>

          <span className="w-px h-5 bg-[var(--color-border)]" />

          <a
            href="https://www.linkedin.com/in/maria-gurevich-197b356a/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[var(--color-text)] transition-colors duration-[var(--dur-std)] ease-[var(--ease-out)] inline-flex items-center hover:text-[var(--color-accent-gold)]"
          >
            <Linkedin size={18} strokeWidth={1.5} />
          </a>

          <a
            href="https://github.com/nazgula"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[var(--color-text)] transition-colors duration-[var(--dur-std)] ease-[var(--ease-out)] inline-flex items-center hover:text-[var(--color-accent-gold)]"
          >
            <Github size={18} strokeWidth={1.5} />
          </a>
        </div>
      </footer>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          imgDir={lightbox.imgDir}
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={(idx) =>
            setLightbox((prev) => prev && { ...prev, index: idx })
          }
        />
      )}

      {/* Chat */}
      <ChatWidget />
      <ChatLightbox />
    </div>
    </ChatProvider>
  );
}
