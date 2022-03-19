import { Socket } from "socket.io-client";

interface Body {
  group_id: string;
}

export function createNewGroup_emitter(socket: Socket, { group_id }: Body) {
  socket.emit("create-new-group", { group_id });
}
