"use client";

import { useState } from "react";
import { ChatWidget } from "@/components/chat-widget";
import { ProjectGallery } from "@/components/project-gallery";
import { Lightbox } from "@/components/lightbox";
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

export default function Home() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = (imgDir: string, images: GalleryImage[], index: number) => {
    setLightbox({ imgDir, images, index });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Header */}
      <header
        className="animate-fade-down border-b"
        style={{
          padding: "60px 80px 50px",
          borderColor: "var(--color-border)",
        }}
      >
        <h1
          className="text-5xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Maria Gurevich
        </h1>
        <div
          className="mt-1.5 text-base font-normal uppercase tracking-widest"
          style={{ color: "var(--color-warm-grey)", letterSpacing: "0.06em" }}
        >
          Portfolio
        </div>
      </header>

      {/* Projects */}
      <div className="projects-container" style={{ padding: "0 80px" }}>
        {projects.map((project, i) => {
          const parts = project.subtitle.split("|");
          const dateRange = parts[0]?.trim() || "";
          const role = parts[1]?.trim() || "";

          return (
            <div
              key={i}
              className="flex gap-12 border-b animate-fade-up"
              style={{
                padding: "56px 0",
                borderColor: "var(--color-border)",
                animationDelay: `${i * 0.15}s`,
                animationFillMode: "both",
              }}
            >
              {/* Project Info */}
              <div className="flex-1" style={{ flexBasis: "58%", minWidth: 0 }}>
                <h2
                  className="mb-2 text-3xl font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {project.name}
                </h2>
                <div
                  className="mb-4 flex flex-wrap items-center gap-2 text-sm"
                  style={{ color: "var(--color-warm-grey)" }}
                >
                  {dateRange && <span>{dateRange}</span>}
                  {role && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: "var(--color-accent-light)",
                        color: "var(--color-accent)",
                      }}
                    >
                      {role}
                    </span>
                  )}
                </div>
                <p
                  className="mb-3.5 max-w-[560px] text-base leading-7"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {project.description}
                </p>
                {project.stack && (
                  <div
                    className="text-sm italic"
                    style={{ color: "var(--color-warm-grey)" }}
                  >
                    {project.stack}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <ProjectGallery
                imgDir={project.imgDir}
                images={project.images || []}
                projectName={project.name}
                onImageClick={openLightbox}
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          imgDir={lightbox.imgDir}
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={(idx) => setLightbox((prev) => prev && { ...prev, index: idx })}
        />
      )}

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
