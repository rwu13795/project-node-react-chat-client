import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { setFriendsOnlineStatus } from "../../redux/user/userSlice";

// when the user is online, the client will emit the online message to all friends of
// this user. And anyone of the friends is online, the friend's client will also let
// this user know he/she is online by emitting a "online-echo" messsage
export function onlineEcho_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("online-echo", (friend_id: string) => {
    console.log(`user ${friend_id} let me know he is ALSO online`);
    dispatch(setFriendsOnlineStatus({ friend_id, online: true }));
  });
}
