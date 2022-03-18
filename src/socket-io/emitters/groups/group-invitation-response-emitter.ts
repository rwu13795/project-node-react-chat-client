import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  group_id: string;
  accept: boolean;
}

export function groupInvitationResponse_emitter({
  socket,
  group_id,
  accept,
}: Props) {
  socket.emit("group-invitation-response", {
    group_id,
    accept,
  });
}
