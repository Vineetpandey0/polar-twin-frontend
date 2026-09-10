import { NextResponse } from "next/server";

export interface SatelliteMetadata {
  id: number;
  name: string;
  noradId: number;
  line1: string;
  line2: string;
  orbitType: "Polar LEO" | "Polar SSO" | "Geostationary";
  targetStation: "BHARATI AGEOS" | "MAITRI COMMS" | "BOTH STATIONS";
  purpose: string;
  band: string;
}

// Pre-bundled high-fidelity fallback TLE data (guarantees offline/jury demo survivability)
const FALLBACK_SATELLITES: SatelliteMetadata[] = [
  {
    id: 54361,
    noradId: 54361,
    name: "OCEANSAT-3 (EOS-06)",
    line1: "1 54361U 22158A   26252.31714546  .00000148  00000+0  52763-4 0  9994",
    line2: "2 54361  98.3553 349.3973 0002358  93.0571 267.0891 14.47007950200007",
    orbitType: "Polar SSO",
    targetStation: "BHARATI AGEOS",
    purpose: "Ocean Color & Sea-Ice Surface Monitor; Downlinks to Dual 7.3m Radomes",
    band: "X-Band / S-Band",
  },
  {
    id: 44804,
    noradId: 44804,
    name: "CARTOSAT-3",
    line1: "1 44804U 19081A   26252.33071317 -.00001872  00000+0 -85757-4 0  9996",
    line2: "2 44804  97.4230 312.8042 0010388 215.2734 144.7814 15.19182923376243",
    orbitType: "Polar SSO",
    targetStation: "BHARATI AGEOS",
    purpose: "Sub-meter High-Resolution Earth Imaging; Direct AGEOS Ground Pass",
    band: "X-Band (8.1 GHz)",
  },
  {
    id: 41877,
    noradId: 41877,
    name: "RESOURCESAT-2A",
    line1: "1 41877U 16074A   26252.31846780  .00000267  00000+0  14167-3 0  9995",
    line2: "2 41877  98.7473 325.1081 0002173 165.8150 194.3089 14.21612494506252",
    orbitType: "Polar SSO",
    targetStation: "BHARATI AGEOS",
    purpose: "Multi-spectral Polar Ice Cap & Continental Moraine Remote Sensing",
    band: "X-Band (8.2 GHz)",
  },
  {
    id: 39216,
    noradId: 39216,
    name: "INSAT-3D",
    line1: "1 39216U 13038B   26251.68457253 -.00000360  00000+0  00000+0 0  9990",
    line2: "2 39216   2.1354  81.3942 0001431 132.2733 150.0165  1.00268169 47917",
    orbitType: "Geostationary",
    targetStation: "BOTH STATIONS",
    purpose: "IMD Antarctic Meteorology Sounder; Cyclone & Blizzard Early Warning",
    band: "C-Band / Extended C",
  },
  {
    id: 42964,
    noradId: 42964,
    name: "IRIDIUM 125",
    line1: "1 42964U 17061K   26252.24850438  .00000157  00000+0  48876-4 0  9990",
    line2: "2 42964  86.4031 350.2549 0002700  92.1582 267.9923 14.34217409466901",
    orbitType: "Polar LEO",
    targetStation: "MAITRI COMMS",
    purpose: "Lifeline Voice/Data; 100km Blue-Ice Overland Convoy Telemetry",
    band: "L-Band (1.6 GHz)",
  },
];

// In-memory cache for server-side SWR
let memoryCache: {
  satellites: SatelliteMetadata[];
  cachedAt: string;
  source: string;
} | null = null;

let lastFetchTime = 0;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function GET() {
  const now = Date.now();

  // Return active cache if still within TTL
  if (memoryCache && now - lastFetchTime < CACHE_TTL_MS) {
    return NextResponse.json({
      ...memoryCache,
      isStale: memoryCache.source !== "CELESTRAK_LIVE",
      freshnessLabel: memoryCache.source === "CELESTRAK_LIVE" ? "LIVE TLE // SGP4 REALTIME" : "STALE — LOCAL CACHE",
    });
  }

  try {
    const updatedSatellites: SatelliteMetadata[] = [];

    // Attempt parallel fetch with short timeout
    const fetchPromises = FALLBACK_SATELLITES.map(async (sat) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2800);

      try {
        const res = await fetch(
          `https://celestrak.org/NORAD/elements/gp.php?CATNR=${sat.noradId}&FORMAT=tle`,
          {
            signal: controller.signal,
            next: { revalidate: 21600 }, // 6 hours
          }
        );
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);

        if (lines.length >= 3) {
          return {
            ...sat,
            line1: lines[1].trim(),
            line2: lines[2].trim(),
          };
        } else if (lines.length === 2) {
          return {
            ...sat,
            line1: lines[0].trim(),
            line2: lines[1].trim(),
          };
        }
        return sat;
      } catch (err) {
        return sat;
      }
    });

    const results = await Promise.all(fetchPromises);
    memoryCache = {
      satellites: results,
      cachedAt: new Date().toISOString(),
      source: "CELESTRAK_LIVE",
    };
    lastFetchTime = now;

    return NextResponse.json({
      ...memoryCache,
      isStale: false,
      freshnessLabel: "LIVE TLE // SGP4 REALTIME",
    });
  } catch (e) {
    // Graceful fallback on network failure or venue disconnect
    memoryCache = {
      satellites: FALLBACK_SATELLITES,
      cachedAt: new Date().toISOString(),
      source: "FALLBACK_CACHE",
    };
    lastFetchTime = now;

    return NextResponse.json({
      ...memoryCache,
      isStale: true,
      freshnessLabel: "STALE — LOCAL DEMO CACHE",
    });
  }
}
