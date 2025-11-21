import { useEffect, useState } from "react";

/**
 * Hook to detect if the viewport is in portrait orientation.
 * Updates on window resize.
 */
export const useIsPortrait = (): boolean => {
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isPortrait;
};
