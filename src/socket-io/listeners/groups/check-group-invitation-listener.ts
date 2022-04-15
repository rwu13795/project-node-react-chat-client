import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { setResult_groupInvitation } from "../../../redux/user/userSlice";

interface Data {
  message: string;
}

export function check_groupInvitation_listener(
  socket: Socket,
  dispatch: Dispatch<any>
) {
  socket.on("check-group-invitation", ({ message }: Data) => {
    // after sending the group-invitation, the server will let the client
    // know how the status of this request. Display this message right next to
    // the selected target in the "GroupForFriend" or "FriendForGroup"
    dispatch(setResult_groupInvitation(message));
  });
}
