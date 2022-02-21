import { io } from "socket.io-client";

export function connectSocket(user_id: string, username: string) {
  // use the "handshake" to let server to identify the current user
  let socket = io("http://localhost:5000", { query: { user_id, username } });
  return socket;
}
