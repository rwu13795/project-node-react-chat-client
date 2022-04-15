import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { getNotifications } from "../../../redux/message/asyncThunk/get-notifications";
import { getUserAuth } from "../../../redux/user/asyncThunk/get-user-auth";
import { setLoadingStatus_user } from "../../../redux/user/userSlice";
import { loadingStatusEnum } from "../../../utils";

export function newFriendAdded_listener(
  socket: Socket,
  dispatch: Dispatch<any>,
  currentUserId: string
) {
  socket.on("new-friend-added", () => {
    // after the current user accepted a friend request, the server will emit the
    // "new-friend-added" to client, to let the client know that the DB has been updated
    // So fetch the new friendList and notifications

    dispatch(getUserAuth());
    dispatch(getNotifications({ currentUserId }));

    dispatch(setLoadingStatus_user(loadingStatusEnum.addFriend_succeeded));
  });
}
