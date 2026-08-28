const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchStations() {
  const res = await fetch(`${API_BASE}/stations`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch stations");
  return res.json();
}

export async function fetchStationDetail(stationId: string) {
  const res = await fetch(`${API_BASE}/stations/${stationId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch station ${stationId}`);
  return res.json();
}

export async function fetchStationAlerts(stationId: string, severity?: string) {
  const url = `${API_BASE}/stations/${stationId}/alerts${severity ? `?severity=${severity}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function fetchStationInventory(stationId: string) {
  const res = await fetch(`${API_BASE}/stations/${stationId}/inventory`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function acknowledgeAlert(alertId: number) {
  const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to acknowledge alert");
  return res.json();
}
