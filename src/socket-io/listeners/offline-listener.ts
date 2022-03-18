import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  onlineStatus_enum,
  setFriendsOnlineStatus,
} from "../../redux/user/userSlice";

interface Props {
  friend_id: string;
}

// whenever a user is offline/disconnected, the server will emit the offline message
// to all the friends of that user.
export function offline_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("offline", ({ friend_id }: Props) => {
    console.log(`user ${friend_id} is offline`);
    dispatch(
      setFriendsOnlineStatus({
        friend_id,
        status: onlineStatus_enum.offline,
      })
    );
  });
}
