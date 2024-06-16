import { RefObject, useEffect, useState } from "react";

interface Entry {
  isIntersecting: boolean;
  target: Element;
}

type Observer = {
  unobserve: (target: Element) => void;
  disconnect: () => void;
};

export default function useIntersectionObserver(
  reference: RefObject<Element> | null,
  once: boolean = false,
) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleIntersect = (entries: Entry[], observer: Observer) => {
      const entry = entries[0];
      setIsVisible(entry.isIntersecting);
      if (once && entry.isIntersecting) {
        observer.unobserve(entry.target);
        observer.disconnect();
      }
    };

    // Create the observer, passing in the callback
    const observer = new IntersectionObserver(handleIntersect);

    // If we have a ref value, start observing it
    if (reference?.current) {
      observer.observe(reference.current);
    }

    // If unmounting, disconnect the observer
    return () => observer.disconnect();
  }, [reference, once]);

  return isVisible;
}
