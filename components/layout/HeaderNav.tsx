"use client";

import { useEffect, useRef, useState } from "react";
import { useLeadSelection } from "@/components/LeadSelectionProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SectionCta } from "@/components/sections/SectionCta";
import { Logo } from "@/components/Logo";

const DESKTOP_NAV_KEYS = [
  "property",
  "residency",
  "business",
  "adaptation",
  "how",
  "faq",
] as const;

const MOBILE_MENU_KEYS = [
  "property",
  "residency",
  "vehicles",
  "business",
  "insurance",
  "adaptation",
  "how",
  "faq",
] as const;

export function HeaderNav({
  navLabels,
  consultLabel,
}: {
  navLabels: Record<string, string>;
  consultLabel: string;
}) {
  const { clearSelection } = useLeadSelection();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-3.5">
        <a href="#top" className="flex flex-none items-center gap-2.5">
          <Logo className="h-8 w-8" />
          {/* Wordmark hides below the nav breakpoint — with the full
              language switcher and the menu button both required to stay
              visible (FR-02.6), there isn't room for it at mobile widths. */}
          <span className="hidden whitespace-nowrap font-heading text-[17px] font-semibold text-navy nav:inline">
            Spain Relocation Hub
          </span>
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm nav:flex">
          {DESKTOP_NAV_KEYS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="whitespace-nowrap text-ink hover:text-gold-hover"
            >
              {navLabels[key]}
            </a>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-2 nav:gap-3.5">
          <LanguageSwitcher />
          <div className="hidden nav:block">
            <SectionCta label={consultLabel} className="!min-h-11 !px-5 !text-sm" />
          </div>
          <button
            ref={buttonRef}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-[10px] border border-border bg-surface nav:hidden"
          >
            <span className="block h-0.5 w-[18px] bg-navy" />
            <span className="block h-0.5 w-[18px] bg-navy" />
            <span className="block h-0.5 w-[18px] bg-navy" />
          </button>
        </div>
      </div>

      {open ? (
        <div
          ref={panelRef}
          className="flex flex-col border-t border-border bg-surface px-6 pt-2 pb-5 nav:hidden"
        >
          {MOBILE_MENU_KEYS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              onClick={() => setOpen(false)}
              className="border-b border-[#F0F2F5] py-3.5 text-base text-ink"
            >
              {navLabels[key]}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => {
              clearSelection();
              setOpen(false);
            }}
            className="mt-4 rounded-lg bg-gold px-5 py-4 text-center text-base font-semibold text-navy"
          >
            {consultLabel}
          </a>
        </div>
      ) : null}
    </>
  );
}
