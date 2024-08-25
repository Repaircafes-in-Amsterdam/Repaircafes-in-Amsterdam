import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { LOCALES } from "./constants";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: LOCALES });
