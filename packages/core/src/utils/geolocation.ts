/**
 * Helper to get user's geolocation only if permission has been granted.
 * Waits for permission grant if in "prompt" state, throws if denied.
 */
export async function getLocationWhenGranted(): Promise<GeolocationPosition> {
  // Check if Permissions API and Geolocation are available
  if (!navigator.permissions || !navigator.geolocation) {
    throw new Error("Geolocation or Permissions API not supported");
  }

  // Query current geolocation permission
  const status = await navigator.permissions.query({ name: "geolocation" });

  // Helper to fetch actual location
  const fetchLocation = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

  // If already granted, return location immediately
  if (status.state === "granted") {
    return fetchLocation();
  }

  // If denied, we cannot proceed
  if (status.state === "denied") {
    throw new Error("Location permission denied");
  }

  // Otherwise (prompt state), wait for user to grant permission
  return new Promise((resolve, reject) => {
    const handleChange = async () => {
      try {
        if (status.state === "granted") {
          status.onchange = null; // remove listener
          const pos = await fetchLocation();
          resolve(pos);
        } else if (status.state === "denied") {
          status.onchange = null;
          reject(new Error("Location permission denied"));
        }
      } catch (err) {
        status.onchange = null;
        reject(err);
      }
    };

    status.onchange = handleChange;
  });
}

/**
 * Get current location with optional timeout and error handling.
 * Returns null if geolocation fails or is not supported.
 */
export async function getCurrentLocation(
  timeoutMs: number = 5000,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const position = await Promise.race([
      getLocationWhenGranted(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Geolocation timeout")), timeoutMs),
      ),
    ]);
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch (error) {
    // Permission denied, not supported, or timeout - return null
    return null;
  }
}
