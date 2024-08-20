"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import useLinkPostfix from "@/app/utils/useLinkPostfix";
import { useTranslations } from "next-intl";

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
