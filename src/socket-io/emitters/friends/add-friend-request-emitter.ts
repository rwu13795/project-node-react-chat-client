import { Socket } from "socket.io-client";

export function addFriendRequest_emitter(
  socket: Socket,
  data: {
    sender_id: string;
    sender_username: string;
    sender_email: string;
    message: string;
    target_id: string;
  }
) {
  socket.emit("add-friend-request", data);
}
