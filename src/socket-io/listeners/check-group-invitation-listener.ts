import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { loadChatHistory_database } from "../../redux/message/asyncThunk/load-chat-history";
import { chatType, resetVisitedRoom } from "../../redux/message/messageSlice";
import { getGroupMembersList_database } from "../../redux/user/asyncThunk/get-members-list";
import {
  Group,
  setResult_groupInvitation,
  updateGroupsList,
} from "../../redux/user/userSlice";

interface CheckResponse {
  message: string;
  newGroupsList?: Group[];
  newGroupId?: string;
}

export function check_groupInvitation_listener(
  socket: Socket,
  dispatch: Dispatch<any>
) {
  socket.on(
    "check-group-invitation",
    ({ message, newGroupsList, newGroupId }: CheckResponse) => {
      console.log("check-group-invitation", message);

      if (newGroupsList && newGroupId && newGroupsList.length > 0) {
        // when the user accepted and join the group, update the client groupsList
        dispatch(updateGroupsList(newGroupsList));
        // if the group which the user has left is the same group he is joining now,
        // Since the user can enter the group room even he has left, the visitedRoom
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
        }, 2000);
      } else {
        dispatch(setResult_groupInvitation(message));
      }
    }
  );
}
