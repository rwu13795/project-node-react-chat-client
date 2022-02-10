import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { getNotifications } from "../../redux/message/asyncThunk/get-notifications";
import { getUserAuth } from "../../redux/user/asyncThunk/get-user-auth";

export function addFriendResponse_listener(
  socket: Socket,
  dispatch: Dispatch<any>,
  currentUserId: string
) {
  socket.on("add-friend-response", (newFriend: string) => {
    console.log(
      `user ${newFriend} has accepted you request, you are friends now!`
    );
    // after the user accepted the request, get the updated friends_pair, private_message and
    // notification from server. Have to wait for a few seconds since the DB might be being updated
    setTimeout(() => {
      // don't initialize the onlineStatus, otherwise all friends will be marked as offline
      dispatch(getUserAuth({ initialize: false }));
      dispatch(getNotifications(currentUserId));
    }, 4000);
  });
}
