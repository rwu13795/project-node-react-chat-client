import { Socket } from "socket.io-client";

export function onlineEcho_emitter(
  socket: Socket,
  data: {
    friend_id: string;
  }
) {
  socket.emit("online-echo", data);
}
