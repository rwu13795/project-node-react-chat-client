import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  MessageObject,
} from "../../redux/message/messageSlice";
import { getGroupMembersList_database } from "../../redux/user/asyncThunk/get-members-list";

import {
  clearLeftMember,
  setGroupInvitation,
} from "../../redux/user/userSlice";

interface Props {
  messageObject: MessageObject;
  room_type: string;
  group_id: string;
}

export function groupAdminNotification_listener(
  socket: Socket,
  dispatch: Dispatch<any>
) {
  socket.on(
    "group-admin-notification",
    ({ messageObject, room_type, group_id }: Props) => {
      dispatch(
        addNewMessageToHistory_memory({
          messageObject,
          room_type,
        })
      );

      // if (note === "left") {
      //   // remove the user from membersList who just left or was kicked
      //   dispatch(clearLeftMember({ group_id, member_user_id }));
      // } else {
      //   // fetch a new membersList after a new member has joined
      //   console.log("getting new group members list");

      dispatch(getGroupMembersList_database({ group_id, initialize: true }));
      // }
    }
  );
}
