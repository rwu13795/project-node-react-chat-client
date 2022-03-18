import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  friend_id: string;
  group_id: string;
  group_name: string;
  inviter_name: string;
}

export function groupInvitationRequest_emitter({
  socket,
  friend_id,
  group_id,
  group_name,
  inviter_name,
}: Props) {
  socket.emit("group-invitation-request", {
    friend_id,
    group_id,
    group_name,
    inviter_name,
  });
}
