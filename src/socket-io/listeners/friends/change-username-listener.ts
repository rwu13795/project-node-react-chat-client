import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { setFriendNewName } from "../../../redux/user/userSlice";

interface Data {
  sender_id: string;
  new_name: string;
}

export function changeUsername_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("change-username", ({ sender_id, new_name }: Data) => {
    dispatch(setFriendNewName({ sender_id, new_name }));
  });
}
