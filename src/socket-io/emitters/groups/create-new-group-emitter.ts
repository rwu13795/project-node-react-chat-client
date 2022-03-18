import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  group_id: string;
}

export function createNewGroup_emitter({ socket, group_id }: Props) {
  socket.emit("create-new-group", { group_id });
}
