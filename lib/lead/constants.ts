// Order matches messages/*.json `form.serviceLabels` and the six service
// content sections (property/residency/vehicles/business/insurance/adaptation).
export const SERVICE_KEYS = [
  "property",
  "residency",
  "vehicles",
  "business",
  "insurance",
  "adaptation",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];
