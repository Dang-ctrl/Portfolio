"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

export default function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: SITE.timezone });
    const update = () => setTime(`${fmt.format(new Date())} IST`);
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular" suppressHydrationWarning>{time || "—"}</span>;
}
