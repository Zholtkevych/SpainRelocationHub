export function Logo({
  className = "",
  stroke = "#0A2A5E",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 74 L10 40 A 30 30 0 0 1 70 40 L70 74"
        stroke={stroke}
        strokeWidth="9"
        strokeLinecap="square"
      />
      <circle cx="40" cy="37" r="13" fill="#C9A227" />
      <polygon points="30,45 50,45 40,63" fill="#C9A227" />
      <circle cx="40" cy="37" r="4.8" fill="#0A2A5E" />
    </svg>
  );
}
