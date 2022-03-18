import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  group_id: string;
  member_user_id: string;
  member_username: string;
}

export function kickMember_emitter({
  socket,
  group_id,
  member_user_id,
  member_username,
}: Props) {
  socket.emit("kick-member", {
    group_id,
    member_user_id,
    member_username,
  });
}
