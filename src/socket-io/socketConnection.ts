import { io, Socket } from "socket.io-client";

export function connectSocket(user_id: string) {
  // use the "handshake" to let server to identify the current user
  let socket = io("http://localhost:5000", { query: { user_id } });
  return socket;
}

export function socket_messageToClients_listener(socket: Socket) {
  socket.on("messageToClients", (msg) => {
    console.log(`client received msg from server ---> ${msg}`);
  });
}

// send the UI client key to socket server for identification
// socket.emit("clientAuth", "abcdefg");
