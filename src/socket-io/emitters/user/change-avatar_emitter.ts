import { Socket } from "socket.io-client";

interface Body {
  buffer: Blob;
  type: string;
}

export function changeAvatar_emitter(socket: Socket, imageObject: Body) {
  socket.emit("change-avatar", imageObject);
}
