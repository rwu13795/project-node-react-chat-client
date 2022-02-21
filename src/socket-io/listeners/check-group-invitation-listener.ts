import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  Group,
  setResult_groupInvitation,
  updateGroupsList,
} from "../../redux/user/userSlice";

interface CheckResponse {
  message: string;
  groupsList?: Group[];
}

export function check_groupInvitation_listener(
  socket: Socket,
  dispatch: Dispatch
) {
  socket.on(
    "check-group-invitation",
    ({ message, groupsList }: CheckResponse) => {
      console.log("groupsList", groupsList);

      if (groupsList && groupsList.length > 0) {
        dispatch(updateGroupsList(groupsList));
      } else {
        dispatch(setResult_groupInvitation(message));
      }
    }
  );
}
