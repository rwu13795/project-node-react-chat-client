import { Socket } from "socket.io-client";

export function leaveGroup_emitter(
  socket: Socket,
  data: {
    group_id: string;
    user_id: string;
    admin_user_id: string;
  }
) {
  socket.emit("leave-group", data);
}
