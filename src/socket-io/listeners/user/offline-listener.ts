import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  onlineStatus_enum,
  setFriendsOnlineStatus,
} from "../../../redux/user/userSlice";

interface Data {
  sender_id: string;
}

// whenever a user is offline/disconnected, the server will emit the offline message
// to all the friends of that user.
export function offline_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("offline", ({ sender_id }: Data) => {
    console.log(`user ${sender_id} is offline`);
    dispatch(
      setFriendsOnlineStatus({
        sender_id,
        status: onlineStatus_enum.offline,
      })
    );
  });
}
