import createMiddleware from "next-intl/middleware";
import { LOCALES } from "./app/constants";

export default createMiddleware({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: LOCALES[0],
});

// console.log("LOCALES: ", LOCALES);
// // const path = `/(${LOCALES.join("|")})/:path*`;
// const path = "/(en|nl)/:path*";
// console.log("path: ", path);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|nl)/:path*"],
};
