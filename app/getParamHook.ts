// import { trackEvent } from "@/app/utils/analytics";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

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
        applyParams(createQueryString(param, value, params));
      }
      return searchParams;
    }

    function clear(params?: URLSearchParams) {
      const finalParams =
        params || new URLSearchParams(searchParams.toString());
      finalParams.delete(param);
      applyParams(finalParams.toString());
      return finalParams;
    }

    return {
      value,
      label,
      setValue,
    };
  };
}

function applyParams(paramString: string) {
  window.history.pushState(null, "", `?${paramString}`);
}
