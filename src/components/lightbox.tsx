"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface LightboxImage {
  file: string;
  caption: string;
}

interface LightboxProps {
  imgDir: string;
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNav: (index: number) => void;
}

export function Lightbox({ imgDir, images, index, onClose, onNav }: LightboxProps) {
  const current = images[index];

  const handleNav = useCallback(
    (dir: number) => {
      onNav((index + dir + images.length) % images.length);
    },
    [index, images.length, onNav]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handleNav(-1);
      if (e.key === "ArrowRight") handleNav(1);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, handleNav]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        background: "rgba(15, 17, 23, 0.94)",
        backdropFilter: "blur(12px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: "absolute",
          top: "24px",
          right: "28px",
          background: "none",
          border: "none",
          color: "var(--color-text-inv)",
          fontSize: "2rem",
          cursor: "pointer",
          opacity: 0.7,
          transition: `opacity var(--dur-fast) var(--ease-out)`,
          lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
      >
        &times;
      </button>

      {/* Prev */}
      <button
        onClick={() => handleNav(-1)}
        aria-label="Previous image"
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.3)",
          background: "rgba(255,255,255,0.08)",
          color: "var(--color-text-inv)",
          fontSize: "1.6rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: `background var(--dur-fast) var(--ease-out)`,
          backdropFilter: "blur(4px)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(201,168,76,0.2)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
        }
      >
        &#8249;
      </button>

      {/* Image */}
      <div style={{ maxWidth: "88vw", maxHeight: "78vh", position: "relative" }}>
        <Image
          src={`/${imgDir}/${current.file}`}
          alt={current.caption || ""}
          width={1200}
          height={750}
          style={{
            maxWidth: "88vw",
            maxHeight: "78vh",
            width: "auto",
            height: "auto",
            borderRadius: "var(--r)",
            objectFit: "contain",
            boxShadow: "var(--shadow-dark)",
          }}
        />
      </div>

      {/* Caption */}
      {current.caption && (
        <div
          style={{
            maxWidth: "600px",
            padding: "0 24px",
            textAlign: "center",
            fontSize: "14px",
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            color: "rgba(245, 240, 232, 0.85)",
          }}
        >
          {current.caption}
        </div>
      )}

      {/* Next */}
      <button
        onClick={() => handleNav(1)}
        aria-label="Next image"
        style={{
          position: "absolute",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.3)",
          background: "rgba(255,255,255,0.08)",
          color: "var(--color-text-inv)",
          fontSize: "1.6rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: `background var(--dur-fast) var(--ease-out)`,
          backdropFilter: "blur(4px)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(201,168,76,0.2)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
        }
      >
        &#8250;
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "rgba(245, 240, 232, 0.4)",
          }}
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
