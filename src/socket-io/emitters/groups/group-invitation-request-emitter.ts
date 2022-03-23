import { Socket } from "socket.io-client";

export function groupInvitationRequest_emitter(
  socket: Socket,
  data: {
    friend_id: string;
    group_id: string;
    group_name: string;
    inviter_name: string;
  }
) {
  socket.emit("group-invitation-request", data);
}
