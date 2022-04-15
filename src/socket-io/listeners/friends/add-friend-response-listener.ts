import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { getUserAuth } from "../../../redux/user/asyncThunk/get-user-auth";
import { setLoadingStatus_user } from "../../../redux/user/userSlice";
import { loadingStatusEnum } from "../../../utils";

interface Data {
  acceptor_name: string;
}

export function addFriendResponse_listener(
  socket: Socket,
  dispatch: Dispatch<any>,
  currentUserId: string
) {
  socket.on("add-friend-response", ({ acceptor_name }: Data) => {
    // after the invitee accepted the request, server will emit the "add-friend-response"
    // get the updated friends_pair, private_message and notification from server for this inviter.
    dispatch(getUserAuth(true));
    dispatch(setLoadingStatus_user(loadingStatusEnum.addFriend_succeeded));
  });
}
