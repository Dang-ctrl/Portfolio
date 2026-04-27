"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
export const useTheme = () => useContext(Ctx);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("vj-theme") as Theme | null;
    const initial = saved ?? "light";
    apply(initial);
  }, []);

  function apply(t: Theme) {
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    localStorage.setItem("vj-theme", t);
  }

  return (
    <Ctx.Provider value={{ theme, toggle: () => apply(theme === "light" ? "dark" : "light") }}>
      {children}
    </Ctx.Provider>
  );
}
