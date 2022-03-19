import { Socket } from "socket.io-client";

interface Body {
  sender_id: string;
  sender_username: string;
  target_id: string;
  target_username: string;
  accept: boolean;
}

export function addFriendResponse_emitter(
  socket: Socket,
  { sender_id, sender_username, target_id, target_username, accept }: Body
) {
  socket.emit("add-friend-response", {
    sender_id,
    sender_username,
    target_id,
    target_username,
    accept,
  });
}
