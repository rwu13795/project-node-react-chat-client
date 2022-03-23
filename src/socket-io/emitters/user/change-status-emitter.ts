import { Socket } from "socket.io-client";

export function changeOnlineStatus_emitter(
  socket: Socket,
  data: {
    status: string;
  }
) {
  socket.emit("online-status-change", data);
}
