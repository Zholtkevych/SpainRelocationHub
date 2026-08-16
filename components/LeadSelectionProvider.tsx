"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ServiceKey } from "@/lib/lead/constants";

type LeadSelectionContextValue = {
  pendingServices: ServiceKey[];
  selectService: (service: ServiceKey) => void;
  clearSelection: () => void;
};

const LeadSelectionContext = createContext<LeadSelectionContextValue | null>(null);

/**
 * Lets a "Request a consultation" button in any service section pre-select
 * that service in the contact form below, without making every section a
 * client component (only the small CTA button and the form itself read
 * this context — see SectionCta.tsx / ContactForm.tsx).
 */
export function LeadSelectionProvider({ children }: { children: ReactNode }) {
  const [pendingServices, setPendingServices] = useState<ServiceKey[]>([]);

  return (
    <LeadSelectionContext.Provider
      value={{
        pendingServices,
        selectService: (service) => setPendingServices([service]),
        clearSelection: () => setPendingServices([]),
      }}
    >
      {children}
    </LeadSelectionContext.Provider>
  );
}

export function useLeadSelection() {
  const ctx = useContext(LeadSelectionContext);
  if (!ctx) {
    throw new Error("useLeadSelection must be used within a LeadSelectionProvider");
  }
  return ctx;
}
