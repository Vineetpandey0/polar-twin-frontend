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

  // 1. If we already established a working connection, use it first for instant response
  if (lastWorkingApiBase) {
    urls.push(`${lastWorkingApiBase}${path}`);
  }

  // 2. In local development, check local backend first (port 8000)
  if (isDev) {
    urls.push(`http://localhost:8000/api/v1${path}`);
    urls.push(`http://127.0.0.1:8000/api/v1${path}`);
  }

  // 3. Primary API base: uses process.env.NEXT_PUBLIC_API_URL || production link
  const envApi = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
  let primaryBase = envApi || PRODUCTION_API_URL;
  if (!primaryBase.endsWith("/api/v1")) {
    primaryBase = `${primaryBase}/api/v1`;
  }
  urls.push(`${primaryBase}${path}`);

  // 4. Fallback production link
  urls.push(`${PRODUCTION_API_URL}/api/v1${path}`);

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
      const timeoutMs = isLocalhost ? 1500 : 4500;
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

// ── Station Metadata & Status ──────────────────────────────────────────

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

// ── Alerts (Live Database) ────────────────────────────────────────────

export async function fetchAllAlerts(stationId?: string, severity?: string, status?: string) {
  const params = new URLSearchParams();
  if (stationId && stationId.toUpperCase() !== "ALL") params.append("station_id", stationId.toLowerCase());
  if (severity && severity.toUpperCase() !== "ALL") params.append("severity", severity.toUpperCase());
  if (status && status.toUpperCase() !== "ALL") params.append("status", status.toUpperCase());

  const qs = params.toString();
  const url = `/alerts${qs ? `?${qs}` : ""}`;
  const res = await smartFetch(url);
  return res.json();
}

export async function fetchStationAlerts(stationId: string, severity?: string, status?: string) {
  const params = new URLSearchParams();
  if (severity && severity.toUpperCase() !== "ALL") params.append("severity", severity.toUpperCase());
  if (status && status.toUpperCase() !== "ALL") params.append("status", status.toUpperCase());

  const qs = params.toString();
  const url = `/stations/${stationId}/alerts${qs ? `?${qs}` : ""}`;
  const res = await smartFetch(url);
  return res.json();
}

export async function acknowledgeAlert(alertId: number) {
  const res = await smartFetch(`/alerts/${alertId}/acknowledge`, { method: "PATCH" });
  return res.json();
}

// ── Inventory & Logistics (Live Database) ──────────────────────────────

export async function fetchAllInventory(stationId?: string, category?: string) {
  const params = new URLSearchParams();
  if (stationId && stationId.toUpperCase() !== "ALL") params.append("station_id", stationId.toLowerCase());
  if (category && category.toUpperCase() !== "ALL") params.append("category", category.toUpperCase());

  const qs = params.toString();
  const url = `/inventory${qs ? `?${qs}` : ""}`;
  const res = await smartFetch(url);
  return res.json();
}

export async function fetchStationInventory(stationId: string, category?: string) {
  const params = new URLSearchParams();
  if (category && category.toUpperCase() !== "ALL") params.append("category", category.toUpperCase());

  const qs = params.toString();
  const url = `/stations/${stationId}/inventory${qs ? `?${qs}` : ""}`;
  const res = await smartFetch(url);
  return res.json();
}

export async function createRequisition(itemId: number, quantity: number, notes?: string) {
  const res = await smartFetch("/inventory/requisition", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_id: itemId, quantity, notes }),
  });
  return res.json();
}

// ── Maintenance Records (Live Database) ────────────────────────────────

export async function fetchMaintenanceRecords(stationId?: string, status?: string, priority?: string) {
  const params = new URLSearchParams();
  if (stationId && stationId.toUpperCase() !== "ALL") params.append("station_id", stationId.toLowerCase());
  if (status && status.toUpperCase() !== "ALL") params.append("status", status.toUpperCase());
  if (priority && priority.toUpperCase() !== "ALL") params.append("priority", priority.toUpperCase());

  const qs = params.toString();
  const url = `/maintenance${qs ? `?${qs}` : ""}`;
  const res = await smartFetch(url);
  return res.json();
}

export async function updateMaintenanceStatus(recordId: number, status: string, notes?: string) {
  const res = await smartFetch(`/maintenance/${recordId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, completed_notes: notes }),
  });
  return res.json();
}

// ── Scenario Simulator (Physics Cascades & ML Models) ──────────────────

export async function fetchScenariosCatalog(stationId?: string) {
  const url = stationId ? `/stations/${stationId}/scenarios/catalog` : "/stations/scenarios/catalog";
  const res = await smartFetch(url);
  return res.json();
}

export async function runScenarioApi(
  stationId: string,
  scenario: string,
  customParams?: Record<string, any>
) {
  const res = await smartFetch(`/stations/${stationId}/scenarios/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenario,
      custom_params: customParams || {},
    }),
  });
  return res.json();
}

// ── AI Diagnostics ────────────────────────────────────────────────────

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
