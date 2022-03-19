import { Socket } from "socket.io-client";

interface Body {
  friend_id: string;
  block: boolean;
}

export function blockFriend_emitter(
  socket: Socket,
  { friend_id, block }: Body
) {
  socket.emit("block-friend", { friend_id, block });
}
