const common = { width: 34, height: 34, viewBox: "0 0 32 32", fill: "none", "aria-hidden": true } as const;

export function PropertyIcon() {
  return (
    <svg {...common}>
      <rect x="6" y="13" width="20" height="14" stroke="#0A2A5E" strokeWidth="2" />
      <path d="M4 13 L16 5 L28 13" stroke="#C9A227" strokeWidth="2" />
    </svg>
  );
}

export function ResidencyIcon() {
  return (
    <svg {...common}>
      <rect x="7" y="4" width="18" height="24" stroke="#0A2A5E" strokeWidth="2" />
      <path d="M12 12 H20 M12 18 H20" stroke="#0A2A5E" strokeWidth="2" />
      <circle cx="16" cy="24" r="2" fill="#C9A227" />
    </svg>
  );
}

export function VehiclesIcon() {
  return (
    <svg {...common}>
      <rect x="4" y="13" width="24" height="8" stroke="#0A2A5E" strokeWidth="2" />
      <circle cx="10" cy="24" r="3" stroke="#C9A227" strokeWidth="2" />
      <circle cx="22" cy="24" r="3" stroke="#C9A227" strokeWidth="2" />
    </svg>
  );
}

export function BusinessIcon() {
  return (
    <svg {...common}>
      <rect x="5" y="18" width="6" height="10" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="13" y="12" width="6" height="16" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="21" y="6" width="6" height="22" stroke="#C9A227" strokeWidth="2" />
    </svg>
  );
}

export function InsuranceIcon() {
  return (
    <svg {...common}>
      <path d="M16 4 L27 8 V17 A 14 14 0 0 1 16 28 A 14 14 0 0 1 5 17 V8 Z" stroke="#0A2A5E" strokeWidth="2" />
      <circle cx="16" cy="15" r="3.5" fill="#C9A227" />
    </svg>
  );
}

export function AdaptationIcon() {
  return (
    <svg {...common}>
      <circle cx="16" cy="16" r="11" stroke="#0A2A5E" strokeWidth="2" />
      <path d="M5 16 H27" stroke="#0A2A5E" strokeWidth="2" />
      <path d="M16 5 A 14 14 0 0 1 16 27 A 14 14 0 0 1 16 5" stroke="#C9A227" strokeWidth="2" />
    </svg>
  );
}
