import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

const LOCALES = ["nl", "en"];
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
  localePrefix: "as-needed",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
