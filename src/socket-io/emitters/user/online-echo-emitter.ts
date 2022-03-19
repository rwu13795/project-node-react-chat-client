import { Socket } from "socket.io-client";

interface Body {
  friend_id: string;
}

export function onlineEcho_emitter(socket: Socket, { friend_id }: Body) {
  socket.emit("online-echo", { friend_id });
}
