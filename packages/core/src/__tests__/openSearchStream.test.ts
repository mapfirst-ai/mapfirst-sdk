/**
 * openSearchStream — the single-request search path.
 *
 * The widget used to make TWO requests per search: POST /properties, then POST
 * /properties/stream to refine pricing. Now the stream runs the search itself
 * and pushes refinements down the same connection, which puts two things at
 * risk that are invisible in prod:
 *
 *   1. ORDERING. Pricing frames can arrive before the caller has computed the
 *      price filter (that only happens after beforeApplyProperties runs). They
 *      must be buffered, not applied — today the server's 3s poll delay hides
 *      the race, and a cache making the first poll instant would expose it.
 *   2. FALLBACK. A deployment without the route, or a failed search, must fall
 *      back to POST /properties rather than render an empty map.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MapFirstCore } from "../index.js";

/** Build an SSE body from frames, optionally split across chunk boundaries. */
function sse(frames: Array<[string, unknown]>): string {
  return frames
    .map(([event, data]) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    .join("");
}

function streamResponse(body: string, chunkSize = 1024, status = 200) {
  const bytes = new TextEncoder().encode(body);
  let i = 0;
  return {
    ok: status >= 200 && status < 300,
    status,
    body: {
      getReader: () => ({
        read: async () => {
          if (i >= bytes.length) return { done: true, value: undefined };
          const value = bytes.slice(i, i + chunkSize);
          i += chunkSize;
          return { done: false, value };
        },
      }),
    },
  };
}

const SEARCH = {
  properties: [
    {
      tripadvisor_id: 1,
      type: "Accommodation",
      location: { latitude: 1, longitude: 2 },
    },
  ],
  filters: { primary_type: "Accommodation" },
  isComplete: false,
  pollingLink: "https://ta.example/poll/1",
};

const PRICED = {
  results: [
    {
      tripadvisor_id: 1,
      type: "Accommodation",
      location: { latitude: 1, longitude: 2 },
      pricing: {
        availability: "available",
        offer: { availability: "available", displayPrice: "$120", price: 120 },
      },
    },
  ],
  isComplete: true,
};

/** State is surfaced through callbacks, not getters — capture it the way a
 *  real consumer does. */
function makeCore(fetchMock: ReturnType<typeof vi.fn>, streaming = true) {
  vi.stubGlobal("fetch", fetchMock);
  const seen = { properties: [] as Array<Record<string, any>>, searching: true };
  const core = new MapFirstCore({
    apiKey: "k",
    useApi: true,
    ...(streaming && { streaming: true }),
    apiUrl: "https://api.test",
    callbacks: {
      onPropertiesChange: (p: unknown) => {
        seen.properties = p as Array<Record<string, any>>;
      },
      onSearchingStateChange: (s: boolean) => {
        seen.searching = s;
      },
    },
  } as never);
  return { core, seen };
}

beforeEach(() => {
  vi.restoreAllMocks();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("openSearchStream", () => {
  it("makes ONE request — no separate POST /properties", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse(
          sse([
            ["properties", SEARCH],
            ["pricing", PRICED],
            ["complete", { isComplete: true }],
          ]),
        ),
      );
    const { core, seen } = makeCore(fetchMock);

    await core.runPropertiesSearch({ body: { filters: {} } as never });

    const urls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(urls).toEqual(["https://api.test/properties/stream"]);
    expect(urls.some((u) => u.endsWith("/properties"))).toBe(false);
  });

  it("does NOT send a pollingLink — that would put the server in resume mode", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse(
          sse([
            ["properties", SEARCH],
            ["complete", { isComplete: true }],
          ]),
        ),
      );
    const { core, seen } = makeCore(fetchMock);

    await core.runPropertiesSearch({ body: { filters: {} } as never });

    const sent = JSON.parse(String(fetchMock.mock.calls[0]![1].body));
    expect(sent.pollingLink).toBeUndefined();
  });

  it("returns the full search envelope, so callers can read filters", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse(
          sse([
            ["properties", SEARCH],
            ["complete", { isComplete: true }],
          ]),
        ),
      );
    const { core, seen } = makeCore(fetchMock);

    const res = await core.runPropertiesSearch({ body: { filters: {} } as never });

    expect(res).toBeTruthy();
    expect(res!.filters.primary_type).toBe("Accommodation");
  });

  it("applies pricing that arrived BEFORE the price filter was known", async () => {
    // Everything in one chunk, so the pricing frame is parsed in the same tick
    // the properties frame resolves — the race the buffer exists to close.
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse(
          sse([
            ["properties", SEARCH],
            ["pricing", PRICED],
            ["complete", { isComplete: true }],
          ]),
          64 * 1024,
        ),
      );
    const { core, seen } = makeCore(fetchMock);

    await core.runPropertiesSearch({ body: { filters: {} } as never });

    const prop = seen.properties[0] as Record<string, any>;
    expect(prop?.pricing?.offer?.displayPrice).toBe("$120");
  });

  it("honours the price filter on buffered frames", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse(
          sse([
            ["properties", SEARCH],
            ["pricing", PRICED],
            ["complete", { isComplete: true }],
          ]),
          64 * 1024,
        ),
      );
    const { core, seen } = makeCore(fetchMock);

    // $120 sits outside 200..500, so the merge must mark it unavailable — this
    // is precisely what applying a frame before the filter was known would miss.
    await core.runPropertiesSearch({
      body: { filters: {} } as never,
      beforeApplyProperties: () => ({ price: { min: 200, max: 500 } }),
    });

    const props = seen.properties;
    expect(props.every((p) => p?.pricing?.availability !== "available")).toBe(true);
  });

  it("survives a frame split across chunk boundaries", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      streamResponse(
        sse([
          ["properties", SEARCH],
          ["pricing", PRICED],
          ["complete", { isComplete: true }],
        ]),
        7, // tiny chunks — every frame straddles a boundary
      ),
    );
    const { core, seen } = makeCore(fetchMock);

    const res = await core.runPropertiesSearch({ body: { filters: {} } as never });

    expect(res!.filters.primary_type).toBe("Accommodation");
    expect(seen.searching).toBe(false);
  });

  it("clears the spinner on complete", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse(
          sse([
            ["properties", SEARCH],
            ["pricing", PRICED],
            ["complete", { isComplete: true }],
          ]),
        ),
      );
    const { core, seen } = makeCore(fetchMock);

    await core.runPropertiesSearch({ body: { filters: {} } as never });

    expect(seen.searching).toBe(false);
  });

  it("falls back to POST /properties on 404 and does not retry the stream", async () => {
    const fetchMock = vi
      .fn()
      // 1st: stream 404 (deployment predates the route)
      .mockResolvedValueOnce({ ok: false, status: 404, body: null })
      // 2nd: the fallback POST /properties
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ...SEARCH, isComplete: true, pollingLink: null }),
      })
      // 3rd: a SECOND search must go straight to /properties
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ...SEARCH, isComplete: true, pollingLink: null }),
      });
    const { core, seen } = makeCore(fetchMock);

    const first = await core.runPropertiesSearch({ body: { filters: {} } as never });
    const second = await core.runPropertiesSearch({ body: { filters: {} } as never });

    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    const urls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(urls[0]).toContain("/properties/stream");
    expect(urls[1]).toBe("https://api.test/properties");
    // The kill switch means the second search never re-tries the stream.
    expect(urls[2]).toBe("https://api.test/properties");
    expect(urls.filter((u) => u.includes("/stream"))).toHaveLength(1);
  });

  it("falls back when the stream ends without ever sending properties", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(streamResponse(sse([["complete", { isComplete: false }]])))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ...SEARCH, isComplete: true, pollingLink: null }),
      });
    const { core, seen } = makeCore(fetchMock);

    const res = await core.runPropertiesSearch({ body: { filters: {} } as never });

    expect(res).toBeTruthy();
    expect(fetchMock.mock.calls.map((c) => String(c[0]))[1]).toBe(
      "https://api.test/properties",
    );
  });

  it("keeps the two-request path when streaming is off", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...SEARCH, isComplete: true, pollingLink: null }),
    });
    const { core } = makeCore(fetchMock, false);

    await core.runPropertiesSearch({ body: { filters: {} } as never });

    expect(String(fetchMock.mock.calls[0]![0])).toBe("https://api.test/properties");
  });
});
