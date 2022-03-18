import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
}

export function logout_emitter({ socket }: Props) {
  socket.emit("log-out");
}
