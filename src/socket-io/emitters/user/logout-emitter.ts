import { Socket } from "socket.io-client";

export function logout_emitter(socket: Socket) {
  socket.emit("log-out");
}
