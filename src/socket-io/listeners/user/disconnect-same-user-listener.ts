import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { resetAfterSignOut_msg } from "../../../redux/message/messageSlice";
import {
  resetAfterSignOut_user,
  setIsLoggedIn,
  setOpenAlertModal_sameUser,
} from "../../../redux/user/userSlice";

export function disconnectSameUser_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on("disconnect_same_user", () => {
    socket.disconnect();
    dispatch(resetAfterSignOut_msg());
    dispatch(resetAfterSignOut_user());
    dispatch(setIsLoggedIn(false));

    dispatch(setOpenAlertModal_sameUser(true));
  });
}
