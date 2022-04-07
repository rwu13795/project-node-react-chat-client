import { Dispatch } from "@reduxjs/toolkit";
import {
  addNewMessageToHistory_memory,
  chatType,
  MessageObject,
  msgType,
} from "../../redux/message/messageSlice";
import { Friend, Group } from "../../redux/user/userSlice";

export function warningMessage(
  targetGroup: Group,
  targetFriend: Friend,
  room_type: string,
  messageObject: MessageObject,
  dispatch: Dispatch
): boolean {
  if (room_type === chatType.group) {
    if (targetGroup && targetGroup.user_left) {
      messageObject.msg_body = `You cannot send any message to this group since you have left.`;
      messageObject.warning = true;
      messageObject.created_at = "";
      messageObject.msg_type = msgType.admin;
      dispatch(
        addNewMessageToHistory_memory({
          messageObject,
          room_type,
        })
      );
      return true;
    } else {
      return false;
    }
  } else {
    if (
      targetFriend &&
      (targetFriend.friend_blocked_user || targetFriend.user_blocked_friend)
    ) {
      messageObject.msg_body = `You ${
        targetFriend.user_blocked_friend ? "blocked" : "were blocked by"
      } this friend, you cannot send any message to him/her!`;
      messageObject.warning = true;
      messageObject.created_at = "";
      messageObject.msg_type = msgType.admin;
      dispatch(
        addNewMessageToHistory_memory({
          messageObject,
          room_type,
        })
      );
      return true;
    } else {
      return false;
    }
  }
}
