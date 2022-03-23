import { Socket } from "socket.io-client";

export function groupInvitationResponse_emitter(
  socket: Socket,
  data: {
    group_id: string;
    accept: boolean;
  }
) {
  socket.emit("group-invitation-response", data);
}
