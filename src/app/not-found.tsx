import TLink from "@/components/TLink";

export default function NotFound() {
  return (
    <main className="not-found-wrap">
      <div>
        <p className="not-found-num">404</p>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"var(--sec)", maxWidth:360, lineHeight:1.75, margin:"20px 0 32px" }}>
          This page doesn't exist. Either it never did or I deleted it at 2am because something felt off.
        </p>
        <TLink
          href="/"
          style={{
            display:"inline-block",
            fontFamily:"var(--font-mono)",
            fontSize:10,
            letterSpacing:"0.1em",
            textTransform:"uppercase",
            color:"var(--pri)",
            textDecoration:"none",
            borderBottom:"0.5px solid var(--acc-hi)",
            paddingBottom:2,
          }}>
          ← Back home
        </TLink>
      </div>
    </main>
  );
}
