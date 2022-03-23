import { Socket } from "socket.io-client";
import { MessageObject } from "../../../redux/message/messageSlice";

interface MessageToServer extends MessageObject {
  file_body?: File;
}

export function message_emitter(
  socket: Socket,
  data: {
    messageObject: MessageToServer;
    room_type: string;
  }
) {
  socket.emit("message-to-server", data);
}
