// Contact details as authored in the prototype. The WhatsApp number matches
// the phone number below, so treat both as real unless SRH says otherwise
// before launch (flagged in the launch-readiness check).
export const siteConfig = {
  name: "Spain Relocation Hub",
  phone: "+34 611 20 90 04",
  phoneHref: "tel:+34611209004",
  email: "madrid.relocation.expert@gmail.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "34611209004",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    instagram: "https://www.instagram.com/olga.rieltor.madrid/",
    facebook: "https://www.facebook.com/Olga.rieltor.madrid",
    linkedin: "https://www.linkedin.com/in/olha-mazurchuk/",
  },
} as const;
