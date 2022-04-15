import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  GroupInvitation,
  setGroupInvitation,
} from "../../../redux/user/userSlice";

interface Data extends GroupInvitation {}

export function groupInvitationRequest_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on("group-invitation-request", (data: Data) => {
    dispatch(setGroupInvitation(data));
  });
}
