import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "wss://predix-dev.com";

function Test() {
  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: "",
      },
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected!");
      socket.emit("test", "Turn off right now!");
    });

    socket.on("test", (data: string) => {
      console.log("📩 Received from server:", data);
      socket.close(); // 한 번 실행 후 종료
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected.");
    });

    socket.on("connect_error", (error) => {
      console.error("❗ WebSocket Connection Error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1 className="text-white text-2xl font-bold text-center">
        Home Component with WebSocket
      </h1>
    </div>
  );
}

export default Test;