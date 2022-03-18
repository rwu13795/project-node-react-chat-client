import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  group_id: string;
}

export function kickedOutOfGroup_emitter({ socket, group_id }: Props) {
  socket.emit("kicked-out-of-group", { group_id });
}
