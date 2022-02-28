import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  MessageObject,
} from "../../redux/message/messageSlice";

interface Props {
  messageObject: MessageObject;
  room_type: string;
}

export function message_listener(socket: Socket, dispatch: Dispatch) {
  socket.on(
    "message-to-client",
    async ({ messageObject, room_type }: Props) => {
      console.log(messageObject);

      dispatch(
        addNewMessageToHistory_memory({
          messageObject,
          room_type,
        })
      );
    }
  );
}
