import { Socket } from "socket.io-client";

export function createNewGroup_emitter(
  socket: Socket,
  data: {
    group_id: string;
  }
) {
  socket.emit("create-new-group", data);
}
