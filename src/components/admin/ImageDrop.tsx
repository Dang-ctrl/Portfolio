"use client";
import { DragEvent, useState } from "react";

/* File picker that also accepts drag & drop. */
export default function ImageDrop({
  onFiles,
  multiple = false,
  label,
  busy = false,
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  label: string;
  busy?: boolean;
}) {
  const [over, setOver] = useState(false);

  const drop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <label
      className={`adrop ${over ? "is-over" : ""} ${busy ? "is-busy" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="visually-hidden"
        disabled={busy}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      <span>{busy ? "Uploading…" : label}</span>
      <span className="adrop-hint">Drop images here or click to choose · compressed automatically</span>
    </label>
  );
}
