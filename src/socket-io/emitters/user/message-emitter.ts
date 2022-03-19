import { Socket } from "socket.io-client";
import { MessageObject } from "../../../redux/message/messageSlice";

interface MessageToServer extends MessageObject {
  file_body?: File;
}

interface Body {
  messageObject: MessageToServer;
  room_type: string;
}

export function message_emitter(
  socket: Socket,
  { messageObject, room_type }: Body
) {
  socket.emit("message-to-server", {
    messageObject,
    room_type,
  });
}
