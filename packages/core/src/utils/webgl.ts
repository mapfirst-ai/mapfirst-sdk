/**
 * Returns true when a WebGL rendering context is available in the current
 * browser.  Returns false in non-browser environments (e.g. SSR) and on
 * devices/browsers where WebGL is unavailable or blocked.
 */
export function isWebGLSupported(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
