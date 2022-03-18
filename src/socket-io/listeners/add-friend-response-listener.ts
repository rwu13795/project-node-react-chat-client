import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { getNotifications } from "../../redux/message/asyncThunk/get-notifications";
import { getUserAuth } from "../../redux/user/asyncThunk/get-user-auth";

interface Props {
  newFriend: string;
}

export function addFriendResponse_listener(
  socket: Socket,
  dispatch: Dispatch<any>,
  currentUserId: string
) {
  socket.on("add-friend-response", ({ newFriend }: Props) => {
    console.log(
      `user ${newFriend} has accepted you request, you are friends now!`
    );
    // after the invitee accepted the request, server will emit the "add-friend-response"
    // get the updated friends_pair, private_message and notification from server for this inviter.
    // don't initialize the onlineStatus, otherwise all friends will be marked as offline
    dispatch(getUserAuth());
    dispatch(getNotifications({ currentUserId }));
  });
}
