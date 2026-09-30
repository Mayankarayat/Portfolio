"use client";

import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { profile } from "@/content/profile";
import { Icon } from "@/components/ui/Icon";

type SectionId = (typeof navigation)[number]["id"];

/**
 * Sticky header with scroll-spy and an accessible mobile menu
 * (disclosure pattern: aria-expanded/controls, Escape to close, focus return).
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActive(top.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => window.scrollY < window.innerHeight * 0.5 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-scrolled={scrolled || open}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-bg/75 data-[scrolled=true]:backdrop-blur-xl"
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="group flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg border border-line-strong font-mono text-xs font-semibold tracking-tight transition-colors group-hover:border-accent group-hover:text-accent"
          >
            MK
          </span>
          <span className="sr-only text-sm font-medium sm:not-sr-only">{profile.name}</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigation.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg aria-[current=true]:bg-elevated aria-[current=true]:text-fg"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={profile.resume} download className="btn btn-ghost hidden !px-4 !py-2 text-sm md:inline-flex">
            Résumé
            <Icon name="download" size={15} />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line-strong md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-bg md:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex h-full flex-col justify-between py-8">
          <ul className="flex flex-col">
            {navigation.map(({ id, label }, i) => (
              <li key={id} className="border-b border-line">
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5 text-3xl font-semibold tracking-tight"
                >
                  {label}
                  <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={profile.resume} download className="btn btn-primary mt-8 justify-center">
            Download résumé
            <Icon name="download" size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
