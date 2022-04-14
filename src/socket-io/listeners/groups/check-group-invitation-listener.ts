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
    // know how the status of this request. Display this message on top of the
    // chat-board
    dispatch(setResult_groupInvitation(message));

    // expand the <div> which contains the check-group-invitation message
    // let elem = document.getElementById("invitation-result");
    // if (elem) elem.style.maxHeight = elem.scrollHeight + "px";
  });
}
