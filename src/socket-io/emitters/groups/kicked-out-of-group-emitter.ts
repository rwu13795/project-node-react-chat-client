import { Socket } from "socket.io-client";

interface Body {
  group_id: string;
}

export function kickedOutOfGroup_emitter(socket: Socket, { group_id }: Body) {
  socket.emit("kicked-out-of-group", { group_id });
}
