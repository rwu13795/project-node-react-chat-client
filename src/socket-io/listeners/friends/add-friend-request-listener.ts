import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  AddFriendRequest,
  setAddFriendRequests,
} from "../../../redux/user/userSlice";

interface Data extends AddFriendRequest {}

export function addFriendRequest_listener(socket: Socket, dispatch: Dispatch) {
  socket.on(
    "add-friend-request",
    ({
      sender_id,
      sender_username,
      sender_email,
      sender_avatar,
      message,
    }: Data) => {
      dispatch(
        setAddFriendRequests({
          sender_id,
          sender_username,
          sender_email,
          sender_avatar,
          message,
        })
      );
    }
  );
}
