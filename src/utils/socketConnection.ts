import { io, Socket } from "socket.io-client";
import { CurrentUser } from "./redux/userSlice";

export function connectSocket(currentUser: CurrentUser) {
  // use the "handshake" to let server to identify the current user
  let socket = io("http://localhost:5000", { query: currentUser });
  return socket;
}

export function socket_messageToClients_listener(socket: Socket) {
  socket.on("messageToClients", (msg) => {
    console.log(`client received msg from server ---> ${msg}`);
  });
}

// send the UI client key to socket server for identification
// socket.emit("clientAuth", "abcdefg");
