"use client";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

export default function BackButton({
  className,
  children,
  backHome = false,
}: {
  className?: string;
  children: ReactNode;
  backHome?: boolean;
}) {
  const router = useRouter();
  const t = useTranslations();
  return (
    <Link
      href="/"
      className={className}
      aria-label={t("go-back")}
      title={t("go-back")}
      {...(!backHome ? { onClick: () => router.back() } : {})}
    >
      {children}
    </Link>
  );
}
