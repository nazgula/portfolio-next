// Mock for react-markdown (ESM-only, can't be transformed by Jest).
// Renders children as plain text — sufficient for testing chat behavior.
// NOTE: This mock does not test markdown rendering itself.
export default function ReactMarkdown({ children }: { children: string }) {
  return <>{children}</>;
}
