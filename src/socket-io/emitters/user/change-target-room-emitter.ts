import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  room_id: string;
}

export function changeTargetRoom_emitter({ socket, room_id }: Props) {
  socket.emit("current-target-room", { room_id });
}
