import { Socket } from "socket.io-client";

interface Body {
  group_id: string;
  user_id: string;
  admin_user_id: string;
}

export function leaveGroup_emitter(
  socket: Socket,
  { group_id, user_id, admin_user_id }: Body
) {
  socket.emit("leave-group", {
    group_id,
    user_id,
    admin_user_id,
  });
}
