const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/stations";

export class StationWebSocket {
  private socket: WebSocket | null = null;
  private stationId: string;
  private onMessageCallback: (data: any) => void;

  constructor(stationId: string, onMessage: (data: any) => void) {
    this.stationId = stationId;
    this.onMessageCallback = onMessage;
  }

  connect() {
    try {
      this.socket = new WebSocket(`${WS_BASE}/${this.stationId}`);
      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.onMessageCallback(parsed);
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };
      this.socket.onclose = () => {
        setTimeout(() => this.connect(), 5000);
      };
    } catch (e) {
      console.error("WS Connection error", e);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
