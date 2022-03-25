import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  chatType,
  resetVisitedRoom,
} from "../../../redux/message/messageSlice";
import { Group, updateGroupsList } from "../../../redux/user/userSlice";

interface Data {
  newGroupsList: Group[];
  newGroupId: string;
}

export function joinNewGroup_listener(socket: Socket, dispatch: Dispatch<any>) {
  socket.on("join-new-group", ({ newGroupsList, newGroupId }: Data) => {
    // when the user accepted and joined the group, update the client groupsList
    dispatch(updateGroupsList(newGroupsList));
    // if the group which the user has left is the same group he is joining now,
    // since the user can enter the group room even he has left, the visitedRoom
    // needs to be set as false again in order to get the newest messages in the
    // current session after the user joining back the same group
    dispatch(
      resetVisitedRoom({
        room_id: `${chatType.group}_${newGroupId}`,
        visited: false,
      })
    );
    // force the user who just joined the group enter the group room
    setTimeout(() => {
      let elem = document.getElementById(`${chatType.group}_${newGroupId}`);
      if (elem) {
        console.log("enter room ", newGroupId);
        elem.click();
      }
    }, 1000);
  });
}
