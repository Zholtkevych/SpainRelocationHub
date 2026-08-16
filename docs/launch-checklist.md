# Launch checklist

Run `npm run verify:launch-ready` before a production deploy — it fails the
build step (not the normal `npm run build`) if any `{{PLACEHOLDER: ...}}`
sentinel is still present in `messages/*.json`. Each placeholder maps to an
open question from the product spec:

| Placeholder key (`legal.*`) | PDD reference | What's needed |
|---|---|---|
| `controllerEntity` | PDD §12.3 / PRD §19.2 "Data controller identity" | Legal entity name, registration number, registered address |
| `retentionPeriod` | PDD §9.4 | How long enquiry data is kept before erasure |
| `dpoContact` | PDD §9.4 | Contact address for data protection requests |
| `responseCommitment` | PDD §12.3 "Response-time commitment" | Confirmed reply-time SRH can honour. Note: the contact form's visible "We reply the same working day" copy (`form.responseNote` in each `messages/*.json`) states this as fact already — reconcile it with whatever gets confirmed here before launch. |

Other pre-launch items not covered by the placeholder check:

- **WhatsApp number** — `NEXT_PUBLIC_WHATSAPP_NUMBER` defaults to the number
  found in the original prototype (`34611209004`, matching the site's
  displayed phone number). Confirm this is the number SRH wants
  receiving WhatsApp enquiries before launch.
- **Hero photography** — `components/sections/Hero.tsx` currently ships a
  diagonal-stripe placeholder background (no licensed photography exists
  yet — PDD risk register flags this explicitly). Replace with licensed or
  commissioned photography of Madrid/Spain before launch.
- **Email delivery** — set `RESEND_API_KEY`, `LEAD_FROM_EMAIL`, and
  `LEAD_NOTIFICATION_EMAIL` in production. Without `RESEND_API_KEY`, lead
  submissions only log to the server console (see `lib/lead/email.ts`).
- **`NEXT_PUBLIC_SITE_URL`** — set to the real production domain; it drives
  canonical URLs, hreflang alternates, the sitemap, and Open Graph metadata.
