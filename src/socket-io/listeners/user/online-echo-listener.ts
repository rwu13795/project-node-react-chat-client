import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { setFriendsOnlineStatus } from "../../../redux/user/userSlice";

interface Props {
  sender_id: string;
  status: string;
}

// when the user is online, the client will emit the online message to all friends of
// this user. And the friends who are online will also let this user know he/she
// is online by emitting a "online-echo" messsage
export function onlineEcho_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("online-echo", ({ sender_id, status }: Props) => {
    console.log(
      `user ${sender_id} let me know he change online status to ${status}`
    );

    dispatch(setFriendsOnlineStatus({ sender_id, status }));
  });
}
