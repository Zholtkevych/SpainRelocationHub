"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
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

  return (
    <div className="border-t border-border">
      {items.map((item, index) => {
        const isOpen = expanded.has(index);
        return (
          <div key={item.q} className="border-b border-border">
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="flex min-h-12 w-full items-start justify-between gap-5 bg-transparent py-5.5 text-left"
            >
              <span className="text-[17px] leading-snug font-medium text-navy">{item.q}</span>
              <span
                className="flex-none text-xl text-gold-hover transition-transform"
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
                <p className="m-0 max-w-2xl pb-6 text-base leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
