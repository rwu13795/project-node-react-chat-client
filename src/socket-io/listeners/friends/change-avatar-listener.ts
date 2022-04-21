import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { setFriendNewAvatar } from "../../../redux/user/userSlice";

interface Data {
  sender_id: string;
  new_avatar_url: string;
}

export function changeAvatar_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("change-avatar", ({ sender_id, new_avatar_url }: Data) => {
    console.log("new_avatar_url", new_avatar_url);

    dispatch(setFriendNewAvatar({ sender_id, new_avatar_url }));
  });
}
