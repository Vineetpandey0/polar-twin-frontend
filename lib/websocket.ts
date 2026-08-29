const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/stations";

export class StationWebSocket {
  private socket: WebSocket | null = null;
  private stationId: string;
  private onMessageCallback: (data: any) => void;
  private isDestroyed = false;

  constructor(stationId: string, onMessage: (data: any) => void) {
    this.stationId = stationId;
    this.onMessageCallback = onMessage;
  }

  connect() {
    if (this.isDestroyed) return;
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      let targetUrl = `${WS_BASE}/${this.stationId}`;
      if (typeof window !== "undefined" && window.location.protocol === "https:" && targetUrl.startsWith("ws://")) {
        targetUrl = targetUrl.replace("ws://", "wss://");
      }

      this.socket = new WebSocket(targetUrl);

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.onMessageCallback(parsed);
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };

      this.socket.onclose = () => {
        if (!this.isDestroyed) {
          setTimeout(() => this.connect(), 5000);
        }
      };

      this.socket.onerror = (err) => {
        console.warn("WS Error encountered:", err);
      };
    } catch (e) {
      console.error("WS Connection error", e);
      if (!this.isDestroyed) {
        setTimeout(() => this.connect(), 5000);
      }
    }
  }

  disconnect() {
    this.isDestroyed = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
