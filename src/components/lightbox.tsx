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
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-4 bg-black/92 backdrop-blur-lg animate-in fade-in duration-250"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="absolute right-7 top-6 border-none bg-none text-3xl leading-none text-white opacity-70 transition-opacity hover:opacity-100"
        aria-label="Close lightbox"
      >
        &times;
      </button>

      <button
        onClick={() => handleNav(-1)}
        className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-white/22"
        aria-label="Previous image"
      >
        &#8249;
      </button>

      <div className="relative" style={{ maxWidth: "88vw", maxHeight: "78vh" }}>
        <Image
          src={`/${imgDir}/${current.file}`}
          alt={current.caption || ""}
          width={1200}
          height={750}
          className="rounded-lg object-contain shadow-2xl animate-in zoom-in-95 duration-300"
          style={{ maxWidth: "88vw", maxHeight: "78vh", width: "auto", height: "auto" }}
        />
      </div>

      {current.caption && (
        <div className="max-w-[600px] px-6 text-center text-sm text-white/85">
          {current.caption}
        </div>
      )}

      <button
        onClick={() => handleNav(1)}
        className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-white/22"
        aria-label="Next image"
      >
        &#8250;
      </button>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
