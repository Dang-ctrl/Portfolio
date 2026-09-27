"use client";
import { useState, FormEvent } from "react";
import { SITE } from "@/lib/site";

const MAX_CHARS = 3000;
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_honey")) return; // bot filled the hidden field

    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${SITE.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          _subject: `Portfolio message from ${data.get("name")}`,
          _template: "table",
        }),
      });
      const json = await res.json().catch(() => ({}));
      // FormSubmit returns 200 with success:"false" on some failures — check both.
      if (!res.ok || String(json.success) === "false") throw new Error(json.message ?? res.statusText);
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="form" noValidate={false}>
      <div className="field-row">
        <label className="field">
          <span className="field-label">Name</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label className="field">
        <span className="field-label">Message</span>
        <textarea name="message" rows={5} required maxLength={MAX_CHARS} />
      </label>
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden />

      <div className="form-actions">
        <button type="submit" className="btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="form-status" role="status">
          {status === "sent" && "Thanks — message received. I'll reply within a day."}
          {status === "error" && (
            <>Couldn&apos;t send that. Email me directly at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</>
          )}
        </p>
      </div>
    </form>
  );
}
