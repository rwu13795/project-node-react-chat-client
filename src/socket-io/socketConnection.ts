import { io } from "socket.io-client";

export default function connectSocket(user_id: string, username: string) {
  const socket = io(process.env.REACT_APP_SERVER_URL!, {
    // use the "handshake" to let server to identify the current user
    query: { user_id, username },
    // withCredentials: true,
  });

  return socket;
}
