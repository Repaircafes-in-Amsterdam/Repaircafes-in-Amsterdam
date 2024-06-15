"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

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
  return (
    <Link
      href="/"
      className={className}
      aria-label="Go back"
      title="Go back"
      {...(!backHome ? { onClick: () => router.back() } : {})}
    >
      {children}
    </Link>
  );
}
