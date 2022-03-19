import { Socket } from "socket.io-client";

interface Body {
  group_id: string;
  member_user_id: string;
  member_username: string;
}

export function kickMember_emitter(
  socket: Socket,
  { group_id, member_user_id, member_username }: Body
) {
  socket.emit("kick-member", {
    group_id,
    member_user_id,
    member_username,
  });
}
