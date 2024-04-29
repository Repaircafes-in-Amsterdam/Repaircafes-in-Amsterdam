import Logo from "@/app/Logo.svg";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex bg-blue p-3">
      <Link href="/">
        <Logo />
      </Link>
    </header>
  );
}
