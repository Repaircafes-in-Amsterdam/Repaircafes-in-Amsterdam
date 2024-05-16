"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function BackButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <Link
      href="/"
      className={className}
      onClick={() => router.back()}
      aria-label="Go back"
      title="Go back"
    >
      {children}
    </Link>
  );
}
