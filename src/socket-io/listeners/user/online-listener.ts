import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { setFriendsOnlineStatus } from "../../../redux/user/userSlice";
import { onlineEcho_emitter } from "../../emitters";

interface Body {
  sender_id: string;
  status: string;
}

// whenever a friend is online, his/her client will emit the online message.
// listen to that message, and mark this friend as online in the store
export function online_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("online", ({ sender_id, status }: Body) => {
    console.log(
      `user ${sender_id} just emit "online" as ${status}, let him know I am online`
    );
    dispatch(setFriendsOnlineStatus({ sender_id, status }));

    // let the friend who just logged in know that the current user is online also
    onlineEcho_emitter(socket, { friend_id: sender_id });
  });
}
