import { Socket } from "socket.io-client";

// I used the http request to handle the changeUsername
// instead of replacing the entire request logic, just add a new emitter to
// emit the "change-username"
export function changeUsername_emitter(
  socket: Socket,
  data: {
    new_name: string;
  }
) {
  socket.emit("change-username", data);
}
