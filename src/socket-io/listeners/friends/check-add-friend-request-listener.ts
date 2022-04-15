import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  setLoadingStatus_user,
  setResult_addFriendRequest,
} from "../../../redux/user/userSlice";
import { loadingStatusEnum } from "../../../utils";

interface Data {
  message: string;
}

export function check_addFriendRequest_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on("check-add-friend-request", ({ message }: Data) => {
    dispatch(setResult_addFriendRequest(message));
    dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
  });
}
