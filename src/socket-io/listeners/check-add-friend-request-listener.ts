import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { setResult_addFriendRequest } from "../../redux/user/userSlice";

interface Props {
  message: string;
}

export function check_addFriendRequest_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on("check-add-friend-request", ({ message }: Props) => {
    console.log(message);

    dispatch(setResult_addFriendRequest(message));
  });
}
