"use client";

export default function PixelPortrait() {
  return (
    <div className="landing-right" style={{ position: "relative" }}>
      <img
        src="/pics/portrait.png"
        alt="Vidit Dang — pixel portrait"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          imageRendering: "pixelated",
        }}
      />
      <p className="pixel-caption">Chennai, India · 2025</p>
    </div>
  );
}
