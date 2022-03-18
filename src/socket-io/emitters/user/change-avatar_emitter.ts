import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  imageObject: {
    buffer: Blob;
    type: string;
  };
}

export function changeAvatar_emitter({ socket, imageObject }: Props) {
  socket.emit("change-avatar", imageObject);
}
