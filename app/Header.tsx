import Image from "next/image";
import logo from "@/public/images/logo.svg";

export default function Header() {
  return (
    <header className="p-3 bg-blue flex">
      <Image priority src={logo} alt="Logo" />
    </header>
  );
}
