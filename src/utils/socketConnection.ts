import { io } from "socket.io-client";

let socket = io("http://localhost:5000");

// send the UI client key to socket server for identification
// socket.emit("clientAuth", "abcdefg");
socket.on("messageToClients", (msg) => {
  console.log(`client received msg from server ---> ${msg}`);
});

export default socket;
