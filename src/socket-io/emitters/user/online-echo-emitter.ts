import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  friend_id: string;
}

export function onlineEcho_emitter({ socket, friend_id }: Props) {
  socket.emit("online-echo", { friend_id });
}
