import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  GroupInvitation,
  setGroupInvitation,
} from "../../../redux/user/userSlice";

interface Body extends GroupInvitation {}

export function groupInvitationRequest_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  console.log("groupInvitationRequest_listener----------------");

  socket.on("group-invitation-request", (body: Body) => {
    dispatch(setGroupInvitation(body));
  });
}
