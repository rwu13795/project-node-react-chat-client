import { Socket } from "socket.io-client";

export function changeAvatar_emitter(
  socket: Socket,
  data: {
    buffer: Blob;
    type: string;
  }
) {
  socket.emit("change-avatar", data);
}
