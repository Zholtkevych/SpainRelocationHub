"use client";

import { useLeadSelection } from "@/components/LeadSelectionProvider";
import type { ServiceKey } from "@/lib/lead/constants";

export function SectionCta({
  label,
  service,
  variant = "solid",
  className = "",
}: {
  label: string;
  /** Omit to clear the selection instead (used by the header/hero CTA). */
  service?: ServiceKey;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const { selectService, clearSelection } = useLeadSelection();

  const base =
    "inline-flex min-h-12 items-center rounded-lg px-7 text-base font-semibold transition-colors";
  const styles =
    variant === "solid"
      ? "bg-gold text-navy hover:bg-gold-hover"
      : "border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white";

  return (
    <a
      href="#contact"
      onClick={() => (service ? selectService(service) : clearSelection())}
      className={`${base} ${styles} ${className}`}
    >
      {label}
    </a>
  );
}
