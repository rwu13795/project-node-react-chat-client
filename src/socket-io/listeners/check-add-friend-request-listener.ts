import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { setResult_addFriendRequest } from "../../redux/user/userSlice";

export function check_addFriendRequest_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on("check-add-friend-request", (message: string) => {
    console.log(message);

    dispatch(setResult_addFriendRequest(message));
  });
}
