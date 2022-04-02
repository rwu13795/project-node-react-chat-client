import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import {
  chatType,
  resetVisitedRoom,
  updateGroupNote_afterJoining,
} from "../../../redux/message/messageSlice";
import {
  deleteGroupInvitation,
  Group,
  setLoadingStatus_user,
  updateGroupsList,
} from "../../../redux/user/userSlice";
import { loadingStatusEnum } from "../../../utils";

export interface NewGroupNotification {
  group_id: string;
  count: number;
  last_added_at: string;
}

interface Data {
  note: NewGroupNotification;
  newGroupsList: Group[];
  newGroupId: string;
}

export function joinNewGroup_listener(socket: Socket, dispatch: Dispatch<any>) {
  socket.on("join-new-group", ({ note, newGroupsList, newGroupId }: Data) => {
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

    console.log("note", note);

    dispatch(updateGroupNote_afterJoining(note));
    dispatch(deleteGroupInvitation(newGroupId));
    dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    // // force the user who just joined the group enter the group room
    // let elem = document.getElementById(`${chatType.group}_${newGroupId}`);
    // if (elem) {
    //   console.log("enter room ", newGroupId);
    //   elem.click();
    // }
  });
}
