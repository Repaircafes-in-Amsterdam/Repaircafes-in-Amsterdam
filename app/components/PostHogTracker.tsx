"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import useDistrict from "../useDistrict";
import useOutsideOfficeHours from "../useOutsideOfficeHours";
import { usePathname } from "@/i18n/routing";

export default function PostHogTracker({
  locale,
}: Readonly<{ locale: string }>) {
  const pathname = usePathname();
  const postHog = usePostHog();

  useEffect(() => {
    if (!postHog || !pathname) return;
    // Note: intentionally ignoring search params
    let url = window.origin + pathname;
    postHog.capture("$pageview", {
      $current_url: url,
      title: document.title,
      locale,
    });
  }, [pathname, postHog, locale]);

  const { value: district } = useDistrict();
  useEffect(() => {
    postHog?.capture("district set", {
      district,
    });
  }, [district, postHog]);

  const { value: rawOutsideOfficeHours } = useOutsideOfficeHours();
  const outsideOfficeHours = rawOutsideOfficeHours === "true";
  useEffect(() => {
    postHog?.capture("outside office hours set", {
      outsideOfficeHours,
    });
  }, [outsideOfficeHours, postHog]);

  return null;
}
