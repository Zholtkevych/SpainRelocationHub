"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items, dark = false }: { items: FaqItem[]; dark?: boolean }) {
  // Independent expansion per item (PRD FR-05.5): a Set, not a single index.
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  const borderClass = dark ? "border-white/25" : "border-border";

  return (
    <div className={`border-t ${borderClass}`}>
      {items.map((item, index) => {
        const isOpen = expanded.has(index);
        return (
          <div key={item.q} className={`border-b ${borderClass}`}>
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="flex min-h-12 w-full items-start justify-between gap-5 bg-transparent py-5.5 text-left"
            >
              <span className={`text-[17px] leading-snug font-medium ${dark ? "text-white" : "text-navy"}`}>
                {item.q}
              </span>
              <span
                className={`flex-none text-xl transition-transform ${dark ? "text-gold" : "text-gold-hover"}`}
                style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {/*
              Answer text always renders in the markup (not mounted only when
              expanded) so it's present in the served HTML for crawlers and
              link previews — PRD FR-05.4. Only visibility is toggled.
            */}
            <div
              id={`faq-answer-${index}`}
              className="overflow-hidden transition-[grid-template-rows] duration-200"
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="min-h-0">
                <p
                  className={`m-0 max-w-2xl pb-6 text-base leading-relaxed ${dark ? "text-[#C9D3E6]" : "text-muted"}`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
