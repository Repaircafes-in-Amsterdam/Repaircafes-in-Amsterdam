"use client";
import { ReactNode } from "react";
import useLinkPostfix from "@/app/utils/useLinkPostfix";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../navigation";

export default function BackButton({
  className,
  children,
  backHome = false,
}: {
  className?: string;
  children: ReactNode;
  backHome?: boolean;
}) {
  const linkPostfix = useLinkPostfix();
  const router = useRouter();
  const t = useTranslations();
  return (
    <Link
      href={`/${linkPostfix}`}
      className={className}
      aria-label={t("go-back")}
      title={t("go-back")}
      {...(!backHome ? { onClick: () => router.back() } : {})}
    >
      {children}
    </Link>
  );
}
