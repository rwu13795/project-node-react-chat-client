import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  friend_id: string;
  block: boolean;
}

export function blockFriend_emitter({ socket, friend_id, block }: Props) {
  socket.emit("block-friend", { friend_id, block });
}
