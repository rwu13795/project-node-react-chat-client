import { Socket } from "socket.io-client";

export function online_emitter(
  socket: Socket,
  data: {
    onlineStatus: string;
    target_id?: string;
  }
) {
  socket.emit("online", data);
}
