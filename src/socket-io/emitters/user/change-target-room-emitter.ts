import { Socket } from "socket.io-client";

interface Body {
  room_id: string;
}

export function changeTargetRoom_emitter(socket: Socket, { room_id }: Body) {
  socket.emit("current-target-room", { room_id });
}
