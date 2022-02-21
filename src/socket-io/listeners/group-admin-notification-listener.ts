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
} from "../../redux/user/userSlice";

interface Props {
  messageObject_res: MessageObject & RoomType;
  note_type: string;
  group_id: string;
  member_user_id: string;
}

export function groupAdminNotification_listener(
  socket: Socket,
  dispatch: Dispatch<any>
) {
  socket.on(
    "group-admin-notification",
    ({ messageObject_res, note_type, group_id, member_user_id }: Props) => {
      console.log("note_type", note_type, group_id, member_user_id);
      console.log("messageObject", messageObject_res);

      dispatch(
        addNewMessageToHistory_memory({
          ...messageObject_res,
        })
      );

      if (note_type === "left") {
        dispatch(clearLeftMember({ group_id, member_user_id }));
      } else {
        dispatch(getGroupMembersList_database({ group_id }));
      }
    }
  );
}
