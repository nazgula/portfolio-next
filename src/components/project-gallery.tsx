"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

interface ProjectGalleryProps {
  imgDir: string;
  images: GalleryImage[];
  projectName: string;
  onImageClick: (imgDir: string, images: GalleryImage[], index: number) => void;
}

export function ProjectGallery({
  imgDir,
  images,
  projectName,
  onImageClick,
}: ProjectGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
      <div
        className="group"
        onClick={() => hasImages && onImageClick(imgDir, images, currentSlide)}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 10",
          borderRadius: "var(--r)",
          overflow: "hidden",
          background: "var(--color-border)",
          cursor: hasImages ? "pointer" : "default",
          boxShadow: "var(--shadow-card)",
          transition: `box-shadow var(--dur-std) var(--ease-out)`,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "var(--shadow-lift)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "var(--shadow-card)")
        }
      >
        {hasImages ? (
          <>
            <Image
              src={`/${imgDir}/${images[currentSlide].file}`}
              alt={`${projectName} screenshot`}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-[1.02]"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
            <span
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: "var(--r)",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                pointerEvents: "none",
                opacity: 0,
                transition: `opacity var(--dur-std) var(--ease-out)`,
                backdropFilter: "blur(4px)",
              }}
              className="group-hover:!opacity-100"
            >
              Click to expand
            </span>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              color: "var(--color-text-dim)",
              background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-border) 100%)",
            }}
          >
            Images coming soon
          </div>
        )}
      </div>
      {hasImages && images.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "4px 0" }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                transition: `background var(--dur-fast) var(--ease-out)`,
                background:
                  i === currentSlide
                    ? "var(--color-accent-gold)"
                    : "var(--color-border)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
