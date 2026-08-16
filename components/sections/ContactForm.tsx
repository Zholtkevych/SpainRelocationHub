"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useLeadSelection } from "@/components/LeadSelectionProvider";
import { buildWhatsAppHref } from "@/lib/lead/whatsapp";
import { trackWhatsAppClick } from "@/components/WhatsAppButton";
import { SERVICE_KEYS, type ServiceKey } from "@/lib/lead/constants";
import type { Locale } from "@/lib/locale/config";

const CONSENT_TEXT_VERSION = "srh-consent-v1";

type Option = { v: string; l: string };

type Errors = Partial<Record<"name" | "phone" | "email" | "services" | "consent", boolean>>;

function inputClass(hasError: boolean) {
  return `min-h-12 rounded-lg border bg-surface px-3.5 py-3 text-base text-ink outline-none focus-visible:border-navy focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-1 ${
    hasError ? "border-error" : "border-border-input"
  }`;
}

export function ContactForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("form");
  const tWa = useTranslations("whatsapp");
  const { pendingServices } = useLeadSelection();

  const [step, setStep] = useState<1 | 2 | "done">(1);
  // Lazy initializer, not an effect: the value isn't rendered into the DOM
  // (only used server-side for the spam-timing check), so there's no
  // SSR/hydration mismatch to worry about.
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [company, setCompany] = useState(""); // honeypot

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [services, setServices] = useState<ServiceKey[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [country, setCountry] = useState("");
  const [commLang, setCommLang] = useState<string>(locale);
  const [income, setIncome] = useState("");
  const [timeline, setTimeline] = useState("");
  const [people, setPeople] = useState("1");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Syncs local selection from a section CTA clicked *after* this form
    // already mounted — a plain initializer can't cover that later update,
    // and the user can still override the checkboxes afterward.
    if (pendingServices.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setServices(pendingServices);
    }
  }, [pendingServices]);

  function toggleService(key: ServiceKey) {
    setServices((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  }

  function validateStep1(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = true;
    if (phone.replace(/[^0-9]/g, "").length < 7) next.phone = true;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = true;
    if (services.length === 0) next.services = true;
    if (!consent) next.consent = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submitStep1() {
    if (!validateStep1()) return;
    setSubmitting(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "initial",
          name,
          phone,
          email,
          services,
          consent: true,
          consentTextVersion: CONSENT_TEXT_VERSION,
          locale,
          sourceSection: services[0],
          referrer: typeof document !== "undefined" ? document.referrer : undefined,
          company,
          startedAt,
        }),
      });
    } finally {
      setSubmitting(false);
      setStep(2);
    }
  }

  async function submitStep2() {
    setSubmitting(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "qualification",
          name,
          email,
          countryOfResidence: country || undefined,
          preferredLanguage: commLang,
          incomeSource: income || undefined,
          timeline: timeline || undefined,
          partySize: people,
          locale,
          company,
          startedAt,
        }),
      });
    } finally {
      setSubmitting(false);
      setStep("done");
    }
  }

  function resetForm() {
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setServices([]);
    setConsent(false);
    setErrors({});
    setCountry("");
    setCommLang(locale);
    setIncome("");
    setTimeline("");
    setPeople("1");
    setStartedAt(Date.now());
  }

  const serviceLabels = t.raw("serviceLabels") as string[];
  const incomeOptions = t.raw("incomeOptions") as Option[];
  const timelineOptions = t.raw("timelineOptions") as Option[];
  const waHref = buildWhatsAppHref(tWa("greeting"));

  return (
    <div className="border border-border bg-surface p-9">
      {/* Honeypot: off-screen, not display:none, so it stays reachable by
          bots/autofill but invisible and unreachable for real users. */}
      <div
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        aria-hidden="true"
      >
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      {step === 1 ? (
        <div>
          <StepIndicator active={1} label="1 / 2" />
          <div className="mb-2 text-[22px] font-semibold tracking-tight text-navy">
            {t("step1Title")}
          </div>
          <p className="m-0 mb-6.5 text-[15px] leading-relaxed text-muted">{t("step1Lead")}</p>

          <div className="flex flex-col gap-4.5">
            <Field label={t("name")} required error={errors.name && t("reqName")}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePh")}
                className={inputClass(!!errors.name)}
              />
            </Field>

            <Field label={t("phone")} required error={errors.phone && t("reqPhone")}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 00 00 00"
                className={inputClass(!!errors.phone)}
              />
            </Field>

            <Field label="Email" required error={errors.email && t("reqEmail")}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass(!!errors.email)}
              />
            </Field>

            <div className="flex flex-col gap-2.5">
              <label className="text-[13px] font-medium text-ink">
                {t("services")} <span className="text-error">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_KEYS.map((key, i) => {
                  const active = services.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleService(key)}
                      className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                        active
                          ? "border-navy bg-navy text-white"
                          : "border-border-input text-ink hover:border-navy"
                      }`}
                    >
                      {serviceLabels[i]}
                    </button>
                  );
                })}
              </div>
              {errors.services ? (
                <div className="text-xs text-error">{t("reqServices")}</div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setConsent((v) => !v)}
              className="flex items-start gap-3 bg-transparent p-0 text-left"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border ${
                  consent ? "border-navy bg-navy" : "border-border-input"
                }`}
              >
                {consent ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6.5 L4.8 9 L10 3" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                ) : null}
              </span>
              <span className="text-sm leading-relaxed text-ink">{t("consent")}</span>
            </button>
            {errors.consent ? (
              <div className="-mt-2 text-xs text-error">{t("reqConsent")}</div>
            ) : null}

            <button
              type="button"
              disabled={submitting}
              onClick={submitStep1}
              className="mt-1 min-h-12 rounded-lg bg-gold px-7 text-base font-semibold text-navy hover:bg-gold-hover disabled:opacity-60"
            >
              {t("submit1")}
            </button>
            <div className="text-[13px] leading-relaxed text-[#8A8F9A]">
              {t("responseNote")}
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <StepIndicator active={2} label="2 / 2" />
          <div className="mb-6 border-l-[3px] border-[#1E6B4F] bg-[#F1F6F3] px-5 py-4 text-sm leading-relaxed text-[#1E6B4F]">
            {t("savedNote")}
          </div>
          <div className="mb-2 text-[22px] font-semibold tracking-tight text-navy">
            {t("step2Title")}
          </div>
          <p className="m-0 mb-6.5 text-[15px] leading-relaxed text-muted">{t("step2Lead")}</p>

          <div className="flex flex-col gap-4.5">
            <Field label={t("country")}>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputClass(false)}
              />
            </Field>

            <Field label={t("commLang")}>
              <select
                value={commLang}
                onChange={(e) => setCommLang(e.target.value)}
                className={inputClass(false)}
              >
                <option value="uk">Українська</option>
                <option value="ru">Русский</option>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </Field>

            <Field label={t("income")} hint={t("incomeWhy")}>
              <select
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className={inputClass(false)}
              >
                {incomeOptions.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.l}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t("timeline")}>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={inputClass(false)}
              >
                {timelineOptions.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.l}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t("people")}>
              <input
                type="number"
                min={1}
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className={`${inputClass(false)} max-w-40`}
              />
            </Field>

            <div className="mt-1 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={submitStep2}
                className="min-h-12 rounded-lg bg-gold px-7 text-base font-semibold text-navy hover:bg-gold-hover disabled:opacity-60"
              >
                {t("submit2")}
              </button>
              <button
                type="button"
                onClick={() => setStep("done")}
                className="min-h-12 rounded-lg border-[1.5px] border-border-input px-6.5 text-base font-medium text-ink hover:border-navy hover:text-navy"
              >
                {t("skip")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="flex flex-col items-start gap-5">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="22" stroke="#1E6B4F" strokeWidth="2" />
            <path d="M14 25 L21 32 L34 17" stroke="#1E6B4F" strokeWidth="3" />
          </svg>
          <div
            className="font-heading text-[30px] leading-tight text-navy"
            style={{ letterSpacing: "-0.015em" }}
          >
            {t("doneTitle")}
          </div>
          <p className="m-0 text-base leading-relaxed text-muted">{t("doneLead")}</p>
          <div className="w-full bg-surface-alt px-5.5 py-4.5 text-[15px] leading-relaxed text-ink">
            {t("doneUrgent")}
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            onClick={() => trackWhatsAppClick(locale)}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-[#25D366] px-6.5 text-base font-semibold text-white hover:bg-[#1FB855]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.7-.8c.1-.2.1-.3 0-.5l-.7-1.7c-.1-.3-.3-.3-.5-.3h-.5c-.2 0-.5.1-.7.4-.3.3-.9 1-.9 2.3s1 2.7 1.1 2.9a9.6 9.6 0 0 0 3.9 3.4c1.6.6 2 .5 2.4.5.4 0 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1 0-.1-.1-.2-.2-.3Z" />
            </svg>
            {t("doneWa")}
          </a>
          <button
            type="button"
            onClick={resetForm}
            className="border-b border-gold bg-transparent p-0 text-sm text-gold-hover"
          >
            {t("another")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function StepIndicator({ active, label }: { active: 1 | 2; label: string }) {
  return (
    <div className="mb-6.5 flex items-center gap-2">
      <div className="h-[3px] flex-1 bg-gold" />
      <div className={`h-[3px] flex-1 ${active === 2 ? "bg-gold" : "bg-border"}`} />
      <div className="ml-2 font-heading text-[13px] text-[#8A8F9A]">{label}</div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | false;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ink">
        {label} {required ? <span className="text-error">*</span> : null}
      </label>
      {children}
      {error ? <div className="text-xs text-error">{error}</div> : null}
      {hint ? <div className="text-xs leading-relaxed text-[#8A8F9A]">{hint}</div> : null}
    </div>
  );
}
