import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  AddFriendRequest,
  setAddFriendRequests,
} from "../../redux/user/userSlice";

export function addFriendRequest_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("add-friend-request", (data: AddFriendRequest) => {
    console.log(data);

    dispatch(setAddFriendRequests(data));
  });
}
