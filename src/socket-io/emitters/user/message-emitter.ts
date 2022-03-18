import { Socket } from "socket.io-client";
import { MessageObject } from "../../../redux/message/messageSlice";

interface MessageToServer extends MessageObject {
  file_body?: File;
}

interface Props {
  socket: Socket;
  messageObject: MessageToServer;
  room_type: string;
}

export function message_emitter({ socket, messageObject, room_type }: Props) {
  socket.emit("message-to-server", {
    messageObject,
    room_type,
  });
}
