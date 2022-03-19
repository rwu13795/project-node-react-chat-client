import { Socket } from "socket.io-client";

interface Body {
  group_id: string;
  accept: boolean;
}

export function groupInvitationResponse_emitter(
  socket: Socket,
  { group_id, accept }: Body
) {
  socket.emit("group-invitation-response", {
    group_id,
    accept,
  });
}
