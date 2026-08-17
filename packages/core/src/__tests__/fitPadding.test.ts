/**
 * Fit padding must fit the map it is applied to.
 *
 * fitBoundsPadding is fixed at construction (default 50 top / 160 bottom =
 * 210px vertical). When that exceeds the drawing area MapLibre does not clamp
 * it — cameraForBounds computes the space remaining after padding and abandons
 * the camera move when it goes negative:
 *
 *     b = (height - (top + bottom + offset)) / v.y
 *     if (b < 0 || x < 0) return void warnOnce();
 *
 * The only trace is a console warning, so fitBounds becomes a silent no-op.
 * That is how a widget embedded at 315x250 (a 313x197 canvas) ended up
 * switching its markers on a type change while the map framing never moved.
 */
import { describe, it, expect, vi } from "vitest";
import { MapFirstCore } from "../index.js";

/** The real embed that surfaced this: 315x250 iframe -> 313x197 canvas. */
const EMBED = { width: 313, height: 197 };

function makeCore(fitBoundsPadding?: Record<string, number>) {
  return new MapFirstCore({
    apiKey: "k",
    useApi: false,
    platform: "maplibre",
    ...(fitBoundsPadding ? { fitBoundsPadding } : {}),
  } as never);
}

/** A MapLibre-shaped map stub that records what fitBounds was given. */
function makeMapLibreMap(size: { width: number; height: number }) {
  const calls: Array<{ bounds: unknown; opts: any }> = [];
  return {
    calls,
    map: {
      getCanvas: () => ({ clientWidth: size.width, clientHeight: size.height }),
      getContainer: () => ({ clientWidth: size.width, clientHeight: size.height }),
      fitBounds: (bounds: unknown, opts: any) => calls.push({ bounds, opts }),
      flyTo: vi.fn(),
    },
  };
}

/** Drive flyToPOIs against a stub map without a real adapter. */
function flyWith(core: MapFirstCore, map: unknown, points = TWO_POINTS) {
  (core as never as { adapter: unknown }).adapter = { getMap: () => map };
  (core as never as { currentPlatform: string }).currentPlatform = "maplibre";
  core.flyToPOIs(points, undefined, false);
}

const TWO_POINTS = [
  { lat: 51.86, lng: 0.16 },
  { lat: 51.88, lng: 0.18 },
];

describe("fit padding is clamped to the map box", () => {
  it("keeps the configured padding when the map has room", () => {
    const core = makeCore();
    const { map, calls } = makeMapLibreMap({ width: 1280, height: 900 });
    flyWith(core, map);
    // 50 + 160 = 210, well under 60% of 900 — untouched
    expect(calls[0].opts.padding).toEqual({
      top: 50,
      bottom: 160,
      left: 50,
      right: 50,
    });
  });

  it("shrinks padding that would exceed a short map, instead of no-oping", () => {
    const core = makeCore();
    const { map, calls } = makeMapLibreMap(EMBED);
    flyWith(core, map);
    const p = calls[0].opts.padding;
    // the whole point: vertical padding now FITS the 197px canvas
    expect(p.top + p.bottom).toBeLessThan(EMBED.height);
    expect(p.left + p.right).toBeLessThan(EMBED.width);
    // and MapLibre's own guard would no longer trip
    expect(EMBED.height - (p.top + p.bottom)).toBeGreaterThan(0);
    // unclamped, this is what used to be sent — and it is impossible
    expect(50 + 160).toBeGreaterThan(EMBED.height);
  });

  it("preserves the bottom-heavy ratio when shrinking", () => {
    const core = makeCore();
    const { map, calls } = makeMapLibreMap(EMBED);
    flyWith(core, map);
    const p = calls[0].opts.padding;
    // the bottom gutter exists to leave room for the card carousel; scaling
    // must not flatten it into a uniform box
    expect(p.bottom).toBeGreaterThan(p.top);
    expect(p.bottom / p.top).toBeCloseTo(160 / 50, 0);
  });

  it("respects a caller's explicit padding when it fits", () => {
    const core = makeCore({ top: 10, bottom: 10, left: 10, right: 10 });
    const { map, calls } = makeMapLibreMap(EMBED);
    flyWith(core, map);
    expect(calls[0].opts.padding).toEqual({
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    });
  });

  it("clamps a caller's explicit padding when it does not fit", () => {
    const core = makeCore({ top: 300, bottom: 300, left: 300, right: 300 });
    const { map, calls } = makeMapLibreMap(EMBED);
    flyWith(core, map);
    const p = calls[0].opts.padding;
    expect(p.top + p.bottom).toBeLessThan(EMBED.height);
    expect(p.left + p.right).toBeLessThan(EMBED.width);
  });

  it("leaves padding alone when the map size cannot be read", () => {
    const core = makeCore();
    const calls: any[] = [];
    const map = {
      // no getCanvas / getContainer — an adapter we do not recognise
      fitBounds: (bounds: unknown, opts: any) => calls.push({ bounds, opts }),
    };
    flyWith(core, map);
    // guessing would be worse than honouring what the caller configured
    expect(calls[0].opts.padding).toEqual({
      top: 50,
      bottom: 160,
      left: 50,
      right: 50,
    });
  });

  it("survives a map whose size accessors throw", () => {
    const core = makeCore();
    const calls: any[] = [];
    const map = {
      getCanvas: () => {
        throw new Error("detached");
      },
      fitBounds: (bounds: unknown, opts: any) => calls.push({ bounds, opts }),
    };
    expect(() => flyWith(core, map)).not.toThrow();
    expect(calls).toHaveLength(1);
  });

  it("still fits on an extremely short map", () => {
    const core = makeCore();
    const { map, calls } = makeMapLibreMap({ width: 200, height: 80 });
    flyWith(core, map);
    const p = calls[0].opts.padding;
    expect(p.top + p.bottom).toBeLessThan(80);
    expect(p.left + p.right).toBeLessThan(200);
    expect(p.top).toBeGreaterThanOrEqual(0);
    expect(p.bottom).toBeGreaterThanOrEqual(0);
  });
});
