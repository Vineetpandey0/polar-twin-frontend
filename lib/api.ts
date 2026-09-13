const PRODUCTION_API_URL = "https://polar-twin-backend.up.railway.app";

function isDevelopmentEnvironment(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
  }
  return false;
}

let lastWorkingApiBase: string | null = null;

function getApiCandidateUrls(path: string): string[] {
  const isDev = isDevelopmentEnvironment();
  const urls: string[] = [];

  // 1. If we already established a working connection, use it first for sub-millisecond response
  if (lastWorkingApiBase) {
    urls.push(`${lastWorkingApiBase}${path}`);
  }

  // 2. Primary API base: uses process.env.NEXT_PUBLIC_API_URL || production link
  const envApi = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
  let primaryBase = envApi || PRODUCTION_API_URL;
  if (!primaryBase.endsWith("/api/v1")) {
    primaryBase = `${primaryBase}/api/v1`;
  }
  urls.push(`${primaryBase}${path}`);

  // 3. Fallback production link
  urls.push(`${PRODUCTION_API_URL}/api/v1${path}`);

  // 4. Localhost fallback ONLY if explicitly configured for localhost or in dev with no remote env
  if (isDev && (!envApi || envApi.includes("localhost") || envApi.includes("127.0.0.1"))) {
    urls.push(`http://127.0.0.1:8000/api/v1${path}`);
    urls.push(`http://localhost:8000/api/v1${path}`);
  }

  return Array.from(new Set(urls));
}

export async function smartFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const candidates = getApiCandidateUrls(path);
  let lastError: any = null;

  for (const url of candidates) {
    try {
      const isLocalhost = url.includes("127.0.0.1") || url.includes("localhost");
      const controller = new AbortController();
      // Fast 1200ms timeout for localhost check so it falls back to production instantly if not running locally
      const timeoutMs = isLocalhost ? 1200 : 4000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        ...options,
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        try {
          const parsed = new URL(url);
          lastWorkingApiBase = `${parsed.origin}/api/v1`;
        } catch {}
        return res;
      }
    } catch (err) {
      if (lastWorkingApiBase && url.startsWith(lastWorkingApiBase)) {
        lastWorkingApiBase = null;
      }
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to reach backend API at ${path}`);
}

export async function fetchStations() {
  const res = await smartFetch("/stations");
  return res.json();
}

export async function fetchStationDetail(stationId: string) {
  const res = await smartFetch(`/stations/${stationId}`);
  return res.json();
}

export async function fetchTelemetryStatus() {
  const res = await smartFetch("/telemetry/status");
  return res.json();
}

export async function fetchStationAlerts(stationId: string, severity?: string) {
  const url = `/stations/${stationId}/alerts${severity ? `?severity=${severity}` : ""}`;
  const res = await smartFetch(url);
  return res.json();
}

export async function fetchStationInventory(stationId: string) {
  const res = await smartFetch(`/stations/${stationId}/inventory`);
  return res.json();
}

export async function acknowledgeAlert(alertId: number) {
  const res = await smartFetch(`/alerts/${alertId}/acknowledge`, { method: "PATCH" });
  return res.json();
}

export async function runScenarioApi(stationId: string, scenario: string) {
  const res = await smartFetch(`/stations/${stationId}/scenarios/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario }),
  });
  return res.json();
}

export async function sendAiChatApi(messages: any[], stationContext: string) {
  const res = await smartFetch("/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      station_id: stationContext,
    }),
  });
  return res.json();
}

