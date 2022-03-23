import { Socket } from "socket.io-client";

export function kickMember_emitter(
  socket: Socket,
  data: {
    group_id: string;
    member_user_id: string;
    member_username: string;
  }
) {
  socket.emit("kick-member", data);
}
