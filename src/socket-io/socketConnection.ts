import { io } from "socket.io-client";

export default function connectSocket(user_id: string, username: string) {
  const server = process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : "http://localhost:5000";

  const socket = io(server, {
    // use the "handshake" to let server to identify the current user
    query: { user_id, username },
    // withCredentials: true,
    extraHeaders: {
      Origin: "https://www.reachat.live",
    },
  });

  return socket;
}
