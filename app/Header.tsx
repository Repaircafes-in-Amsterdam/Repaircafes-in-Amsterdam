import Image from "next/image";
import logo from "@/public/images/logo.svg";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex bg-blue p-3">
      <Link href="/">
        <Image priority src={logo} alt="Logo" />
      </Link>
    </header>
  );
}
