import { Socket } from "socket.io-client";

export function joinRoom_emitter(
  socket: Socket,
  data: {
    user_id: string;
    group_ids: string[];
  }
) {
  socket.emit("join-room", data);
}
