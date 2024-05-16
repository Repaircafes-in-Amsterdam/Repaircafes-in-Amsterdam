import { RC } from "@/app/types";
import { Organization, WithContext } from "schema-dts";

export default function getCafeJsonLd(rc: RC): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: rc.name,
    description: `Repair Café in Amsterdam ${rc.district} open op ${rc.open.toLowerCase()}`,
    email: rc.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: rc.address + ", Amsterdam",
      addressLocality: rc.district,
      addressCountry: "NL",
    },
    ...(rc.links?.orgPage ? { url: rc.links?.orgPage } : {}),
  };
}
