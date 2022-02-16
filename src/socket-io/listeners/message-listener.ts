import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  MessageObject,
  RoomType,
} from "../../redux/message/messageSlice";

export function message_listener(socket: Socket, dispatch: Dispatch) {
  socket.on(
    "message-to-client",
    async (messageObject: MessageObject & RoomType) => {
      console.log(messageObject);

      dispatch(
        addNewMessageToHistory_memory({
          ...messageObject,
        })
      );
    }
  );
}
