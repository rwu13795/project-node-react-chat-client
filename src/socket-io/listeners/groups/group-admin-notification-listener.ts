import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  MessageObject,
} from "../../../redux/message/messageSlice";
import { getGroupMembersList_database } from "../../../redux/user/asyncThunk/get-members-list";

interface Body {
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
    ({ messageObject, room_type, group_id }: Body) => {
      dispatch(
        addNewMessageToHistory_memory({
          messageObject,
          room_type,
        })
      );

      // get the new member list from server whenever a member joined or left the group
      dispatch(getGroupMembersList_database({ group_id, initialize: true }));
    }
  );
}
