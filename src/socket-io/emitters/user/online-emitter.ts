import { Socket } from "socket.io-client";

interface Body {
  onlineStatus: string;
  target_id?: string;
}

export function online_emitter(
  socket: Socket,
  { onlineStatus, target_id }: Body
) {
  socket.emit("online", { onlineStatus, target_id });
}
