"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  file: string;
  caption: string;
}

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
    <div className="flex flex-1 flex-col gap-3" style={{ flexBasis: "42%", minWidth: 0 }}>
      <div
        className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-lg"
        style={{ background: "var(--color-border)" }}
        onClick={() => hasImages && onImageClick(imgDir, images, currentSlide)}
      >
        {hasImages ? (
          <>
            <Image
              src={`/${imgDir}/${images[currentSlide].file}`}
              alt={`${projectName} screenshot`}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-[1.02]"
              sizes="(max-width: 900px) 100vw, 42vw"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/55 px-2.5 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              Click to expand
            </span>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8e5df] to-[#d9d5ce] text-sm text-[var(--color-warm-grey)]">
            Images coming soon
          </div>
        )}
      </div>
      {hasImages && images.length > 1 && (
        <div className="flex justify-center gap-1.5 py-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="h-2 w-2 rounded-full transition-colors"
              style={{
                background:
                  i === currentSlide
                    ? "var(--color-warm-grey)"
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
