import { Socket } from "socket.io-client";

interface Body {
  friend_id: string;
  group_id: string;
  group_name: string;
  inviter_name: string;
}

export function groupInvitationRequest_emitter(
  socket: Socket,
  { friend_id, group_id, group_name, inviter_name }: Body
) {
  socket.emit("group-invitation-request", {
    friend_id,
    group_id,
    group_name,
    inviter_name,
  });
}
