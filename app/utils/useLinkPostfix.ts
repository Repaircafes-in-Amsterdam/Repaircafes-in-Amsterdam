import { useSearchParams } from "next/navigation";

export default function useLinkPostfix() {
  const searchParams = useSearchParams();
  if (searchParams.size === 0) return "";
  return "?" + searchParams.toString();
}
