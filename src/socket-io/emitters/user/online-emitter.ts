import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  onlineStatus: string;
  target_id?: string;
}

export function online_emitter({ socket, onlineStatus, target_id }: Props) {
  socket.emit("online", { onlineStatus, target_id });
}
