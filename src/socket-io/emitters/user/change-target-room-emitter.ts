import { Socket } from "socket.io-client";

export function changeTargetRoom_emitter(
  socket: Socket,
  data: {
    room_id: string;
  }
) {
  socket.emit("current-target-room", data);
}
