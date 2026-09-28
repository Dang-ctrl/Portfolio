import PixelShape from "./PixelShape";

/* Circular rotating text badge with a pixel arrow in the middle. */
export default function RoundBadge({ text, className }: { text: string; className?: string }) {
  const id = "badge-path";
  return (
    <span className={`rbadge ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="rbadge-ring">
        <defs>
          <path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="289" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <PixelShape name="down" className="rbadge-core" />
    </span>
  );
}
