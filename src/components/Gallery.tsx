"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/* Photo grid with a keyboard-friendly lightbox (native <dialog>). */
export default function Gallery({ images }: { images: GalleryImage[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = useCallback((d: number) => {
    setIndex((i) => (i === null ? i : (i + d + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    el.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => { el.removeEventListener("keydown", onKey); el.removeEventListener("close", onClose); };
  }, [step]);

  if (!images.length) return null;
  const current = index !== null ? images[index] : null;

  return (
    <>
      <div className={`gallery gallery--${Math.min(images.length, 3)}`}>
        {images.map((img, i) => (
          <button key={`${img.src}-${i}`} type="button" className="gallery-item" onClick={() => open(i)} aria-label={`Open photo ${i + 1}${img.alt ? `: ${img.alt}` : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" />
          </button>
        ))}
      </div>

      <dialog ref={dialog} className="lightbox" onClick={(e) => e.target === dialog.current && close()}>
        {current && (
          <figure className="lightbox-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt} />
            <figcaption>
              <span>{current.alt}</span>
              <span className="tabular">{(index ?? 0) + 1} / {images.length}</span>
            </figcaption>
          </figure>
        )}
        <div className="lightbox-controls">
          {images.length > 1 && <button type="button" onClick={() => step(-1)} aria-label="Previous photo">←</button>}
          {images.length > 1 && <button type="button" onClick={() => step(1)} aria-label="Next photo">→</button>}
          <button type="button" onClick={close} aria-label="Close">Close</button>
        </div>
      </dialog>
    </>
  );
}
