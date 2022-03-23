import { Socket } from "socket.io-client";

export function blockFriend_emitter(
  socket: Socket,
  data: {
    friend_id: string;
    block: boolean;
  }
) {
  socket.emit("block-friend", data);
}
