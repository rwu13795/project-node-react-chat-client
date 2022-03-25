import { Socket } from "socket.io-client";

export function changeAvatar_emitter(
  socket: Socket,
  data: {
    buffer: Blob;
    type: string;
  }
) {
  console.log("emitting avatar !!!");

  socket.emit("change-avatar", data);
}
