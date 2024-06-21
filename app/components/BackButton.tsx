"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import useLinkPostfix from "../utils/useLinkPostfix";

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
  return (
    <Link
      href={`/${linkPostfix}`}
      className={className}
      aria-label="Go back"
      title="Go back"
      {...(!backHome ? { onClick: () => router.back() } : {})}
    >
      {children}
    </Link>
  );
}
