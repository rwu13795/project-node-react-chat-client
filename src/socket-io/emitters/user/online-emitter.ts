import { Socket } from "socket.io-client";

export function online_emitter(
  socket: Socket,
  data: {
    onlineStatus: string;
  }
) {
  socket.emit("online", data);
}
