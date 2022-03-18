import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  group_id: string;
  user_id: string;
}

export function leaveGroup_emitter({ socket, group_id, user_id }: Props) {
  socket.emit("leave-group", {
    group_id,
    user_id,
  });
}
