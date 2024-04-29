import Image from "next/image";
import logo from "@/public/images/logo.svg";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-3 bg-blue flex">
      <Link href="/">
        <Image priority src={logo} alt="Logo" />
      </Link>
    </header>
  );
}
