interface AvatarProps {
  size?: number;
}

export function ArchivistAvatar({ size = 32 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        fill="var(--color-bg)"
      />
      <circle
        cx="16"
        cy="16"
        r="9"
        stroke="var(--color-text-muted)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function BarnabyAvatar({ size = 32 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4L16 14M12 14C12 14 12 20 16 22C20 20 20 14 20 14M16 14L12 14M16 14L20 14M10 12L16 6L22 12"
        stroke="var(--color-accent-teal)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 22V28M13 28H19"
        stroke="var(--color-accent-teal)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GlitchAvatar({ size = 32 }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className="animate-glitch-flicker"
    >
      <circle
        cx="16"
        cy="13"
        r="9"
        stroke="var(--color-text-dim)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12.5" cy="12" r="1.5" fill="var(--color-text-dim)" />
      <circle cx="19.5" cy="12" r="1.5" fill="var(--color-text-dim)" />
      <path
        d="M12 17C12 17 14 19 16 19C18 19 20 17 20 17"
        stroke="var(--color-text-dim)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M11 22L9 28M21 22L23 28M14 22L14 28M18 22L18 28"
        stroke="var(--color-text-dim)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VossAvatar({ size = 32 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="var(--color-accent-cobalt)"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="16"
        y1="16"
        x2="16"
        y2="8"
        stroke="var(--color-accent-cobalt)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="16"
        x2="22"
        y2="16"
        stroke="var(--color-accent-cobalt)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2" fill="var(--color-accent-cobalt)" />
    </svg>
  );
}

export function PersonaAvatar({
  personaId,
  size = 32,
}: {
  personaId: string;
  size?: number;
}) {
  switch (personaId) {
    case "archivist":
      return <ArchivistAvatar size={size} />;
    case "barnaby":
      return <BarnabyAvatar size={size} />;
    case "glitch":
      return <GlitchAvatar size={size} />;
    case "voss":
      return <VossAvatar size={size} />;
    default:
      return <ArchivistAvatar size={size} />;
  }
}
