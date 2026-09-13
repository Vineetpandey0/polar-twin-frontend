const PRODUCTION_WS_URL = "wss://polar-twin-backend.up.railway.app/ws/stations";

function isDevelopmentEnvironment(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
  }
  return false;
}

let lastWorkingWsBase: string | null = null;

function getCandidateWsUrls(stationId: string): string[] {
  const isDev = isDevelopmentEnvironment();
  const urls: string[] = [];
  const st = stationId.toLowerCase();

  // 1. If we have a verified working WS base, try it first
  if (lastWorkingWsBase) {
    urls.push(`${lastWorkingWsBase}/${st}`);
  }

  // 2. Primary WebSocket base: uses process.env.NEXT_PUBLIC_WS_URL || production link
  const envWs = process.env.NEXT_PUBLIC_WS_URL?.trim().replace(/\/+$/, "");
  let primaryBase = envWs || PRODUCTION_WS_URL;
  if (!primaryBase.endsWith("/ws/stations")) {
    primaryBase = `${primaryBase}/ws/stations`;
  }
  urls.push(`${primaryBase}/${st}`);

  // 3. Fallback production link
  urls.push(`${PRODUCTION_WS_URL}/${st}`);

  // 4. Localhost fallback ONLY if explicitly configured for localhost or in dev with no remote env
  if (isDev && (!envWs || envWs.includes("localhost") || envWs.includes("127.0.0.1"))) {
    urls.push(`ws://127.0.0.1:8000/ws/stations/${st}`);
    urls.push(`ws://localhost:8000/ws/stations/${st}`);
  }

  return Array.from(new Set(urls));
}

export class StationWebSocket {
  private socket: WebSocket | null = null;
  private stationId: string;
  private candidateUrls: string[] = [];
  private candidateIndex = 0;
  private onMessageCallback: (data: any) => void;
  private onStatusCallback?: (status: "CONNECTING" | "OPEN" | "CLOSED" | "ERROR") => void;
  private isDestroyed = false;
  private reconnectTimer: any = null;

  constructor(
    stationId: string,
    onMessage: (data: any) => void,
    onStatus?: (status: "CONNECTING" | "OPEN" | "CLOSED" | "ERROR") => void
  ) {
    this.stationId = stationId.toLowerCase();
    this.onMessageCallback = onMessage;
    this.onStatusCallback = onStatus;
    this.candidateUrls = getCandidateWsUrls(this.stationId);
  }

  connect() {
    if (this.isDestroyed) return;
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      this.onStatusCallback?.("CONNECTING");

      // Refresh candidate list in case network environment changed
      this.candidateUrls = getCandidateWsUrls(this.stationId);
      let targetUrl = this.candidateUrls[this.candidateIndex % this.candidateUrls.length];

      // Protocol upgrade if page is HTTPS
      if (typeof window !== "undefined") {
        if (window.location.protocol === "https:" && targetUrl.startsWith("ws://")) {
          targetUrl = targetUrl.replace("ws://", "wss://");
        }
      }

      this.socket = new WebSocket(targetUrl);

      this.socket.onopen = () => {
        try {
          const parsed = new URL(targetUrl);
          lastWorkingWsBase = `${parsed.protocol}//${parsed.host}/ws/stations`;
        } catch {}
        this.onStatusCallback?.("OPEN");
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.onMessageCallback(parsed);
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };

      this.socket.onclose = () => {
        this.onStatusCallback?.("CLOSED");
        if (lastWorkingWsBase && targetUrl.startsWith(lastWorkingWsBase)) {
          lastWorkingWsBase = null;
        }
        this.socket = null;
        if (!this.isDestroyed) {
          // Immediately cycle to next candidate (e.g. from local to production Railway)
          this.candidateIndex = (this.candidateIndex + 1) % this.candidateUrls.length;
          this.reconnectTimer = setTimeout(() => this.connect(), 2000);
        }
      };

      this.socket.onerror = (err) => {
        this.onStatusCallback?.("ERROR");
        if (lastWorkingWsBase && targetUrl.startsWith(lastWorkingWsBase)) {
          lastWorkingWsBase = null;
        }
        console.warn(`WebSocket link attempt to ${targetUrl} failed.`);
      };
    } catch (e) {
      this.onStatusCallback?.("ERROR");
      if (!this.isDestroyed) {
        this.candidateIndex = (this.candidateIndex + 1) % this.candidateUrls.length;
        this.reconnectTimer = setTimeout(() => this.connect(), 2000);
      }
    }
  }

  disconnect() {
    this.isDestroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

