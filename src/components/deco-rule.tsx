export function DecoRule({ className = "" }: { className?: string }) {
  return (
    <div className={`deco-rule ${className}`}>
      <span className="diamond" />
    </div>
  );
}
