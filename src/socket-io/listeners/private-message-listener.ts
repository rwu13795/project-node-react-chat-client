import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  MessageObject,
  RoomIdentifier,
} from "../../redux/message/messageSlice";

export function privateMessage_toClient_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on(
    "privateMessage_toClient",
    async (messageObject: MessageObject & RoomIdentifier) => {
      console.log(messageObject);

      dispatch(
        addNewMessageToHistory_memory({
          ...messageObject,
          file_body: "",
        })
      );
    }
  );
}
