import { Socket } from "socket.io-client";

interface Body {
  status: string;
}

export function changeOnlineStatus_emitter(socket: Socket, { status }: Body) {
  socket.emit("online-status-change", { status });
}
