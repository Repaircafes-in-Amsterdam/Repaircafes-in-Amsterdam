// import { trackEvent } from "../utils/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export type Option = {
  value: string;
  label?: string;
  description?: string;
};

export default function getParamHook(
  param: string,
  defaultValue: string,
  options?: Option[],
  // trackAnalytics: boolean = true
) {
  return () => {
    const router = useRouter();
    const pathname = usePathname();
    // const [searchParams, setSearchParams] = useSearchParams();
    const searchParams = useSearchParams();

    const value = searchParams.get(param) ?? defaultValue;
    const label =
      options?.find((option) => option.value === value)?.label || "";

    const createQueryString = useCallback(
      (name: string, value: string, params?: URLSearchParams) => {
        const finalParams =
          params || new URLSearchParams(searchParams.toString());
        finalParams.set(name, value);

        return finalParams.toString();
      },
      [searchParams],
    );

    function setValue(value: string, params?: URLSearchParams) {
      // if (trackAnalytics) {
      //   trackEvent("Change param", param, value || "default");
      // }
      if (value === defaultValue) {
        clear(params);
      } else {
        router.push(pathname + "?" + createQueryString(param, value, params));
      }
      return searchParams;
    }

    function clear(params?: URLSearchParams) {
      const finalParams =
        params || new URLSearchParams(searchParams.toString());
      finalParams.delete(param);
      // setSearchParams(finalParams);
      router.push(pathname + "?" + finalParams.toString());
      return finalParams;
    }

    return {
      value,
      label,
      setValue,
    };
  };
}
