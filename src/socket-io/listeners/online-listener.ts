import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  onlineStatus_enum,
  setFriendsOnlineStatus,
} from "../../redux/user/userSlice";

// whenever a friend is online, his/her client will emit the online message.
// listen to that message, and mark this friend as online in the store
export function online_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("online", (friend_id: string) => {
    console.log(`user ${friend_id} just logged in, let him know I am online`);
    dispatch(
      setFriendsOnlineStatus({
        friend_id,
        // since the friend just logged in, the status should be set as "available" as default
        status: onlineStatus_enum.available,
      })
    );

    // let the friend who just logged in know that the current user is online also
    socket.emit("online-echo", friend_id);
  });
}
