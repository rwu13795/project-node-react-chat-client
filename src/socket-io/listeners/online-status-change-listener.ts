import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { setFriendsOnlineStatus } from "../../redux/user/userSlice";

interface Props {
  friend_id: string;
  status: string;
}

export function onlineStatusChange_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on("online-status-change", ({ friend_id, status }: Props) => {
    dispatch(setFriendsOnlineStatus({ friend_id, status }));
  });
}
