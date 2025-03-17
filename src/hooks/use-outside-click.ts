import { useEffect, RefObject } from "react";

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  isOpen: boolean,
  onClose: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!isOpen || !enabled) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref, isOpen, onClose, enabled]);
}
