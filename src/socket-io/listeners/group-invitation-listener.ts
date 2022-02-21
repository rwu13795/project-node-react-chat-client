import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  GroupInvitation,
  setGroupInvitation,
} from "../../redux/user/userSlice";

export function groupInvitation_listener(socket: Socket, dispatch: Dispatch) {
  socket.on("group-invitation-request", (data: GroupInvitation) => {
    console.log(data);

    dispatch(setGroupInvitation(data));
  });
}
