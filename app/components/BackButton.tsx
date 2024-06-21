"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Link
      href={`/?${searchParams.toString()}`}
      className={className}
      aria-label="Go back"
      title="Go back"
      {...(!backHome ? { onClick: () => router.back() } : {})}
    >
      {children}
    </Link>
  );
}
