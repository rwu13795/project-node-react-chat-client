import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  status: string;
}

export function changeOnlineStatus_emitter({ socket, status }: Props) {
  socket.emit("online-status-change", status);
}
