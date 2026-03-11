"use client";

import React, { useState } from "react";
import { ChatWidget } from "@/components/chat-widget";
import { ProjectGallery } from "@/components/project-gallery";
import { Lightbox } from "@/components/lightbox";
import { DecoRule } from "@/components/deco-rule";
import { Linkedin, Github } from "lucide-react";
import { InlineChat } from "@/components/inline-chat";
import projects from "@/data/projects.json";

interface GalleryImage {
  file: string;
  caption: string;
}

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
    <div style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      {/* ── Hero ── */}
      <header
        className="hero-section animate-fade-down"
        style={{
          padding: "0",
          position: "relative",
          background: "var(--color-surface)",
          minHeight: "clamp(320px, 45vw, 520px)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Hero Image — left-aligned, full height */}
        {/* Hero Image — left, fading inward */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "25%",
            paddingTop: "16px",
            pointerEvents: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/creation.png"
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 15%",
              maskImage: "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>

        {/* Hero Text */}
        <div
          style={{
            width: "100%",
            padding: "var(--sp-12) var(--margin) var(--sp-6)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <span className="corner-ornament top-left" />
          <span className="corner-ornament top-right" />
          <span className="corner-ornament bottom-left" />
          <span className="corner-ornament bottom-right" />

          <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--color-text)",
            margin: "0 0 var(--sp-2) 0",
          }}
        >
          Maria Gurevich
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(11px, 1.2vw, 13px)",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
            margin: "0 0 var(--sp-2) 0",
          }}
        >
          Fullstack Developer &middot; UX Designer &middot; Building with AI
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: "320px",
            height: "1px",
            background: "var(--color-border)",
            margin: "0 auto var(--sp-3)",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 400,
            color: "var(--color-text-muted)",
            margin: "0 auto var(--sp-3)",
            textAlign: "center",
            width: "100%",
            display: "block",
          }}
        >
          I build what I want because I can.
        </p>

          <DecoRule />
        </div>
      </header>

      {/* ── Work Section ── */}
      <section
        id="work"
        className="projects-container deco-pattern"
        style={{
          background: "var(--color-bg)",
          padding: "var(--sp-8) var(--margin) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
          }}
        >
        {/* ── Portfolio Assistant (AI project card) ── */}
        <div
          className="project-card animate-fade-up"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "var(--sp-6)",
            padding: "var(--sp-2) 0",
            marginBottom: "var(--sp-12)",
            background: "var(--color-surface)",
            borderRadius: "var(--r)",
            boxShadow: "var(--shadow-card)",
            animationFillMode: "both",
          }}
        >
          {/* Text side */}
          <div
            style={{
              flex: "1 1 55%",
              minWidth: 0,
              padding: "var(--sp-2) var(--sp-6)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--color-text)",
                marginBottom: "var(--sp-1)",
              }}
            >
              Portfolio Assistant
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "var(--sp-1)",
                marginBottom: "var(--sp-2)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--color-text-dim)",
                  letterSpacing: "0.06em",
                }}
              >
                2025 · Ongoing
              </span>
              <span
                style={{
                  background: "#E8E0F0",
                  color: "#3A1A5A",
                  borderRadius: "var(--r-pill)",
                  padding: "2px 12px",
                  fontSize: "11px",
                  fontWeight: 500,
                  fontFamily: "var(--font-body)",
                }}
              >
                AI Engineer
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "var(--color-text-muted)",
                maxWidth: "560px",
                marginBottom: "var(--sp-2)",
              }}
            >
              A conversational AI built with the Claude API and Vercel AI SDK,
              deployed on Next.js. Ask it anything about my work, skills, or
              availability — it answers from a curated context window.
            </p>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "var(--color-text)",
              }}
            >
              Claude API · Vercel AI SDK · Next.js · TypeScript
            </div>
          </div>

          {/* Live chat demo */}
          <div
            className="project-gallery-col"
            style={{
              flex: "1 1 45%",
              minWidth: 0,
              padding: "var(--sp-2) var(--sp-4)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InlineChat />
          </div>
        </div>

        {projects.map((project, i) => {
          const parts = project.subtitle.split("|");
          const dateRange = parts[0]?.trim() || "";
          const role = parts[1]?.trim() || "";
          const isReverse = i % 2 === 1;
          const chipStyle = getRoleChipStyle(role);
          const techItems = project.stack
            ? project.stack.split("·").map((t) => t.trim())
            : [];

          return (
            <React.Fragment key={i}>
            <div
              className={`project-card animate-fade-up ${isReverse ? "reverse" : ""}`}
              style={{
                display: "flex",
                flexDirection: isReverse ? "row-reverse" : "row",
                gap: "var(--sp-6)",
                padding: "var(--sp-6) 0",
                marginBottom: "var(--sp-12)",
                background: "var(--color-surface)",
                borderRadius: "var(--r)",
                borderTop: "2px solid var(--color-accent-gold)",
                boxShadow: "var(--shadow-card)",
                animationDelay: `${i * 0.15}s`,
                animationFillMode: "both",
              }}
            >
              {/* Project Info */}
              <div
                style={{
                  flex: "1 1 55%",
                  minWidth: 0,
                  padding: "var(--sp-4) var(--sp-6)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "var(--color-text)",
                    marginBottom: "var(--sp-1)",
                  }}
                >
                  {project.name}
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "var(--sp-1)",
                    marginBottom: "var(--sp-2)",
                  }}
                >
                  {dateRange && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "var(--color-text-dim)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {dateRange}
                    </span>
                  )}
                  {role && (
                    <span
                      style={{
                        ...chipStyle,
                        borderRadius: "var(--r-pill)",
                        padding: "2px 12px",
                        fontSize: "11px",
                        fontWeight: 500,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {role}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "18px",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "var(--color-text-muted)",
                    maxWidth: "560px",
                    marginBottom: "var(--sp-2)",
                  }}
                >
                  {project.description}
                </p>

                {techItems.length > 0 && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      color: "var(--color-text)",
                    }}
                  >
                    {techItems.join(" · ")}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div
                className="project-gallery-col"
                style={{
                  flex: "1 1 45%",
                  minWidth: 0,
                  padding: "var(--sp-2) var(--sp-4)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ProjectGallery
                  imgDir={project.imgDir}
                  images={project.images || []}
                  projectName={project.name}
                  onImageClick={openLightbox}
                />
              </div>
            </div>
            </React.Fragment>
          );
        })}
        </div>
      </section>

      {/* ── Resume CTA ── */}
      <div
        className="deco-pattern"
        style={{
          background: "var(--color-bg)",
          padding: "64px var(--margin)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "var(--color-border)",
            marginBottom: "48px",
          }}
        />
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent-gold)",
            border: "1px solid var(--color-accent-gold)",
            borderRadius: "var(--r)",
            padding: "10px 28px",
            textDecoration: "none",
            transition:
              "background var(--dur-std) var(--ease-out), color var(--dur-std) var(--ease-out)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent-gold)";
            e.currentTarget.style.color = "var(--color-text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-accent-gold)";
          }}
        >
          Full Resume
        </a>
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "var(--color-border)",
            marginTop: "48px",
          }}
        />
      </div>

      {/* ── Footer ── */}
      <footer
        className="contact-section"
        style={{
          background: "var(--color-surface)",
          padding: "var(--sp-8) var(--margin)",
          textAlign: "center",
        }}
      >
        <DecoRule className="mb-6" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--sp-3)",
            flexWrap: "wrap",
          }}
        >
          <a
            href="mailto:maria.gur.dev@gmail.com"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 400,
              color: "var(--color-text)",
              textDecoration: "none",
              transition: "color var(--dur-std) var(--ease-out)",
              display: "inline-block",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-accent-gold)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
          >
            maria.gur.dev@gmail.com
          </a>

          <span
            style={{
              width: "1px",
              height: "20px",
              background: "var(--color-border)",
            }}
          />

          <a
            href="https://www.linkedin.com/in/maria-gurevich-197b356a/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{
              color: "var(--color-text)",
              transition: "color var(--dur-std) var(--ease-out)",
              display: "inline-flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-accent-gold)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
          >
            <Linkedin size={18} strokeWidth={1.5} />
          </a>

          <a
            href="https://github.com/nazgula"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{
              color: "var(--color-text)",
              transition: "color var(--dur-std) var(--ease-out)",
              display: "inline-flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-accent-gold)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
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

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
