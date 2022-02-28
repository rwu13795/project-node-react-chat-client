import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  MessageObject,
} from "../../redux/message/messageSlice";
import { getGroupMembersList_database } from "../../redux/user/asyncThunk/get-members-list";

import {
  clearLeftMember,
  leaveGroup,
  setGroupInvitation,
} from "../../redux/user/userSlice";

interface Props {
  group_id: string;
}

export function kickedOutOfGroup_listener(
  socket: Socket,
  dispatch: Dispatch<any>
) {
  socket.on("kicked-out-of-group", ({ group_id }: Props) => {
    // let the server know this user was kicked out from the group
    // use socket.leave(room) in the server to disconnect this user from the group
    socket.emit("kicked-out-of-group", group_id);
    // when the user is kicked, the server will mark this user as from the users_in_groups
    // table. The next time this long
    dispatch(leaveGroup({ group_id, was_kicked: true }));
  });
}
