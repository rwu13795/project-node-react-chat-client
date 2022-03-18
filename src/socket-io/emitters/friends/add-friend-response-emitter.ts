import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  sender_id: string;
  sender_username: string;
  target_id: string;
  target_username: string;
  accept: boolean;
}

export function addFriendResponse_emitter({
  socket,
  sender_id,
  sender_username,
  target_id,
  target_username,
  accept,
}: Props) {
  socket.emit("add-friend-response", {
    sender_id,
    sender_username,
    target_id,
    target_username,
    accept,
  });
}
