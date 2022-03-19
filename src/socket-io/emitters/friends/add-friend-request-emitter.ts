import { Socket } from "socket.io-client";

interface Body {
  sender_id: string;
  sender_username: string;
  sender_email: string;
  message: string;
  target_id: string;
}

export function addFriendRequest_emitter(
  socket: Socket,
  { sender_id, sender_username, sender_email, message, target_id }: Body
) {
  socket.emit("add-friend-request", {
    sender_id,
    sender_username,
    sender_email,
    message,
    target_id,
  });
}
