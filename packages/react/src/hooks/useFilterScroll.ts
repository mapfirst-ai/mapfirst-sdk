import { useCallback, useEffect, useRef, useState } from "react";

export const useFilterScroll = (dependency: number) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      setAtStart(true);
      setAtEnd(true);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 0);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    updateScrollButtons();
    if (!el) {
      return;
    }

    const handleScroll = () => updateScrollButtons();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [dependency, updateScrollButtons]);

  const scrollByDir = useCallback((dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    const delta = el.clientWidth * 0.7;
    el.scrollBy({
      left: dir === "next" ? delta : -delta,
      behavior: "smooth",
    });
  }, []);

  return {
    scrollerRef,
    atStart,
    atEnd,
    scrollByDir,
  };
};
