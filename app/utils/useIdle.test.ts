import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useIdle from "./useIdle";

function renderHookHelper<T>(useHook: () => T) {
  const result = { current: undefined as unknown as T };
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function TestComponent() {
    result.current = useHook();
    return null;
  }

  act(() => {
    root.render(createElement(TestComponent));
  });

  return {
    result,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("useIdle", () => {
  beforeEach(() => {
    // @ts-expect-error configure react act environment
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should become true via requestIdleCallback if supported", () => {
    let idleCb: (() => void) | null = null;
    vi.stubGlobal("requestIdleCallback", (cb: () => void) => {
      idleCb = cb;
      return 123;
    });
    vi.stubGlobal("cancelIdleCallback", vi.fn());

    const { result, unmount } = renderHookHelper(() => useIdle(1000));
    expect(result.current).toBe(false);

    act(() => {
      if (idleCb) (idleCb as () => void)();
    });

    expect(result.current).toBe(true);
    unmount();
  });

  it("should fall back to setTimeout if requestIdleCallback is not available", () => {
    vi.stubGlobal("requestIdleCallback", undefined);

    const { result, unmount } = renderHookHelper(() => useIdle());
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);
    unmount();
  });
});
