import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  MessageObject,
  RoomType,
} from "../../redux/message/messageSlice";
import { getGroupMembersList_database } from "../../redux/user/asyncThunk/get-members-list";

import {
  clearLeftMember,
  setGroupInvitation,
  setKickedMember,
} from "../../redux/user/userSlice";

interface Props {
  group_id: string;
  member_user_id: string;
}

export function kickedOutOfGroup_listener(
  socket: Socket,
  dispatch: Dispatch<any>
) {
  socket.on("kicked-out-of-group", ({ group_id, member_user_id }: Props) => {
    console.log(
      `You, member ${member_user_id} was kicked out from group ${group_id}`
    );

    // let the server know this user was kicked out from the group
    // use socket.leave(room) in the server to disconnect this user from the group
    socket.emit("kicked-out-of-group", group_id);

    dispatch(setKickedMember(group_id));
  });
}
