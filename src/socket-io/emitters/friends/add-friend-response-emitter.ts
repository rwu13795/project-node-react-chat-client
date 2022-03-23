import { Socket } from "socket.io-client";

export function addFriendResponse_emitter(
  socket: Socket,
  data: {
    sender_id: string;
    sender_username: string;
    target_id: string;
    target_username: string;
    accept: boolean;
  }
) {
  socket.emit("add-friend-response", data);
}
